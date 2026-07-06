import { suggestRecipesWithAI, generateRecipeDetail, getDailyRecipes, transformRecipe, suggestWeeklyPlan } from '../services/geminiService.js';
import { requireAuth } from './authController.js';
import pool from '../config/db.js';

// DB title cache: 5 dk boyunca aynı sonucu döner, her istekte DB'ye gitme.
let titlesCache = { data: null, expiresAt: 0 };

async function getExistingTitles() {
  if (titlesCache.data && Date.now() < titlesCache.expiresAt) {
    return titlesCache.data;
  }
  try {
    const result = await pool.query('SELECT title FROM recipes');
    const titles = result.rows.map(r => r.title);
    titlesCache = { data: titles, expiresAt: Date.now() + 5 * 60 * 1000 };
    return titles;
  } catch (_) {
    return [];
  }
}

export async function aiTransformRecipe(req, res) {
  const { recipeId, transformation } = req.body;
  if (!recipeId || !transformation) return res.status(400).json({ error: 'recipeId ve transformation gerekli.' });
  const validTransformations = ['vejetaryen', 'kolay', 'saglikli', 'glutensiz'];
  if (!validTransformations.includes(transformation)) return res.status(400).json({ error: 'Geçersiz dönüşüm türü.' });
  try {
    const { rows } = await pool.query(
      `SELECT r.title, r.description,
        (SELECT COALESCE(json_agg(jsonb_build_object('name',i.name,'amount',i.amount,'unit',i.unit)), '[]'::json)
         FROM ingredients i WHERE i.recipe_id = r.id) AS ingredients,
        (SELECT COALESCE(json_agg(jsonb_build_object('step_number',s.step_number,'instruction',s.instruction) ORDER BY s.step_number), '[]'::json)
         FROM recipe_steps s WHERE s.recipe_id = r.id) AS steps
       FROM recipes r
       WHERE r.id = $1`,
      [Number(recipeId)]
    );
    if (!rows.length) return res.status(404).json({ error: 'Tarif bulunamadı.' });
    const recipe = rows[0];
    recipe.ingredients = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients;
    recipe.steps = typeof recipe.steps === 'string' ? JSON.parse(recipe.steps) : recipe.steps;
    const result = await transformRecipe(recipe, transformation);
    res.json({ result });
  } catch (err) {
    console.error('[AI transform]', err.message);
    let userMsg = 'Tarif dönüştürülemedi. Lütfen tekrar deneyin.';
    try {
      const parsed = JSON.parse(err.message);
      const code = parsed?.error?.code;
      if (code === 429) userMsg = 'AI istek limiti aşıldı, lütfen bekleyin.';
      else if (code === 503) userMsg = 'AI servisi şu an yoğun, lütfen birkaç saniye bekleyip tekrar deneyin.';
    } catch (_) {}
    res.status(500).json({ error: userMsg });
  }
}

export async function aiWeeklyPlan(req, res) {
  try {
    // Tüm tarif adlarını + popülerlik bilgisini çek
    const { rows: allRecipes } = await pool.query(
      `SELECT r.id, r.title, r.description, r.difficulty, c.name AS category,
              COUNT(DISTINCT f.user_id)::int AS favorite_count,
              COALESCE(AVG(rr.rating), 0)::numeric(3,1) AS avg_rating
       FROM recipes r
       JOIN categories c ON c.id = r.category_id
       LEFT JOIN user_favorites f ON f.recipe_id = r.id
       LEFT JOIN recipe_ratings rr ON rr.recipe_id = r.id
       GROUP BY r.id, r.title, r.description, r.difficulty, c.name
       ORDER BY favorite_count DESC, avg_rating DESC`
    );

    // Kullanıcının son 4 haftada baktığı tarifleri çek (D: görülmemiş öncelikli)
    const { rows: histRows } = await pool.query(
      `SELECT DISTINCT recipe_id FROM recipe_history
       WHERE user_id = $1 AND viewed_at >= NOW() - INTERVAL '28 days'`,
      [req.userId]
    ).catch(() => ({ rows: [] }));
    const recentIds = new Set(histRows.map(r => r.recipe_id));

    const titles = allRecipes.map(r => r.title);

    // E: AI tema + tarif adı önerisi
    const suggestion = await suggestWeeklyPlan(titles);
    const theme = suggestion.theme || '';
    const aiDays = Array.isArray(suggestion.days) ? suggestion.days : [];

    // Her AI önerisi için DB'de isim eşleştir — önce görülmemiş & popüler
    const usedIds = new Set();
    const days = aiDays.map(s => {
      const name = (s.recipeName || '').toLowerCase().trim();

      // 1. Tam eşleşme (görülmemiş önce)
      let match = allRecipes.find(r =>
        !usedIds.has(r.id) && !recentIds.has(r.id) &&
        r.title.toLowerCase().trim() === name
      );
      // 2. Tam eşleşme (görülmüş de olsa)
      if (!match) match = allRecipes.find(r =>
        !usedIds.has(r.id) && r.title.toLowerCase().trim() === name
      );
      // 3. Kısmi eşleşme (görülmemiş önce, popülerlik sıralı)
      if (!match) match = allRecipes.find(r =>
        !usedIds.has(r.id) && !recentIds.has(r.id) &&
        (r.title.toLowerCase().includes(name) || name.includes(r.title.toLowerCase().trim()))
      );
      // 4. Kısmi eşleşme (görülmüş de)
      if (!match) match = allRecipes.find(r =>
        !usedIds.has(r.id) &&
        (r.title.toLowerCase().includes(name) || name.includes(r.title.toLowerCase().trim()))
      );
      // 5. Fallback: en popüler henüz kullanılmamış tarif
      if (!match) match = allRecipes.find(r => !usedIds.has(r.id) && !recentIds.has(r.id));
      if (!match) match = allRecipes.find(r => !usedIds.has(r.id));

      if (match) usedIds.add(match.id);

      return {
        day: s.day,
        reason: s.reason || '',
        recipe: match ? {
          id: match.id, title: match.title, description: match.description,
          difficulty: match.difficulty, category: match.category
        } : null
      };
    });

    res.json({ theme, days });
  } catch (err) {
    console.error('[AI weekly]', err.message);
    let userMsg = 'AI haftalık öneri alınamadı.';
    try {
      const parsed = JSON.parse(err.message);
      const code = parsed?.error?.code;
      if (code === 429) userMsg = 'AI istek limiti aşıldı, lütfen bekleyin.';
      else if (code === 503) userMsg = 'AI servisi şu an yoğun, lütfen bekleyip tekrar deneyin.';
    } catch (_) {}
    res.status(500).json({ error: userMsg });
  }
}

export async function aiSuggest(req, res) {
  const { ingredients, title } = req.body;
  const ingredientList = Array.isArray(ingredients) ? ingredients : [];
  const titleStr = typeof title === 'string' ? title.trim() : '';
  if (ingredientList.length === 0 && !titleStr) {
    return res.status(400).json({ error: 'ingredients veya title gerekli.' });
  }
  try {
    const existingTitles = await getExistingTitles();
    const result = await suggestRecipesWithAI(ingredientList, titleStr, existingTitles);
    res.json({ recipes: result });
  } catch (err) {
    console.error('[AI suggest]', err.message);
    // Gemini hata mesajını parse et
    let userMsg = 'AI önerisi alınamadı. Lütfen tekrar deneyin.';
    try {
      const parsed = JSON.parse(err.message);
      const code = parsed?.error?.code;
      if (code === 503) userMsg = 'AI servisi şu an yoğun, lütfen birkaç saniye bekleyip tekrar deneyin.';
      else if (code === 429) userMsg = 'AI istek limiti aşıldı, lütfen bekleyin.';
      else if (code === 400) userMsg = 'API anahtarı geçersiz veya süresi dolmuş.';
    } catch (_) {}
    res.status(500).json({ error: userMsg });
  }
}

export async function aiDailySuggestions(req, res) {
  try {
    const existingTitles = await getExistingTitles();
    const result = await getDailyRecipes(existingTitles);
    res.json({ recipes: result });
  } catch (err) {
    console.error('[AI daily]', err.message);
    let userMsg = 'Günlük tarif önerisi alınamadı. Lütfen tekrar deneyin.';
    try {
      const parsed = JSON.parse(err.message);
      const code = parsed?.error?.code;
      if (code === 503) userMsg = 'AI servisi şu an yoğun, lütfen birkaç saniye bekleyip tekrar deneyin.';
      else if (code === 429) userMsg = 'AI istek limiti aşıldı, lütfen bekleyin.';
      else if (code === 400) userMsg = 'API anahtarı geçersiz veya süresi dolmuş.';
    } catch (_) {}
    res.status(500).json({ error: userMsg });
  }
}

export async function aiRecipeDetail(req, res) {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name alanı gerekli.' });
  }
  try {
    const result = await generateRecipeDetail(name);
    res.json({ detail: result });
  } catch (err) {
    console.error('[AI detail]', err.message);
    let userMsg = 'Tarif detayı alınamadı. Lütfen tekrar deneyin.';
    try {
      const parsed = JSON.parse(err.message);
      const code = parsed?.error?.code;
      if (code === 503) userMsg = 'AI servisi şu an yoğun, lütfen birkaç saniye bekleyip tekrar deneyin.';
      else if (code === 429) userMsg = 'AI istek limiti aşıldı, lütfen bekleyin.';
      else if (code === 400) userMsg = 'API anahtarı geçersiz veya süresi dolmuş.';
    } catch (_) {}
    res.status(500).json({ error: userMsg });
  }
}
