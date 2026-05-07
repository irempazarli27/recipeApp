import { suggestRecipesWithAI, generateRecipeDetail, getDailyRecipes, transformRecipe, suggestWeeklyPlan } from '../services/geminiService.js';
import { requireAuth } from './authController.js';
import pool from '../config/db.js';

async function getExistingTitles() {
  try {
    const result = await pool.query('SELECT title FROM recipes');
    return result.rows.map(r => r.title);
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
    // Mevcut kategorileri DB'den çek
    const catResult = await pool.query('SELECT DISTINCT name FROM categories ORDER BY name');
    const categories = catResult.rows.map(r => r.name);
    // AI'dan 7 günlük öneri al
    const suggestions = await suggestWeeklyPlan(categories);
    // Her gün için uygun kategori+zorlukta DB'den rastgele tarif seç
    const days = [];
    for (const s of suggestions) {
      const { rows } = await pool.query(
        `SELECT r.id, r.title, r.description, r.difficulty, c.name AS category
         FROM recipes r
         JOIN categories c ON c.id = r.category_id
         WHERE c.name ILIKE $1
           AND ($2::text IS NULL OR r.difficulty = $2)
         ORDER BY RANDOM()
         LIMIT 1`,
        [s.category, s.difficulty || null]
      );
      // Eğer zorlukla eşleşme yoksa, sadece kategoriye göre dene
      let recipe = rows[0];
      if (!recipe) {
        const fallback = await pool.query(
          `SELECT r.id, r.title, r.description, r.difficulty, c.name AS category
           FROM recipes r JOIN categories c ON c.id = r.category_id
           WHERE c.name ILIKE $1 ORDER BY RANDOM() LIMIT 1`,
          [s.category]
        );
        recipe = fallback.rows[0];
      }
      days.push({ day: s.day, reason: s.reason, recipe: recipe || null });
    }
    res.json({ days });
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
