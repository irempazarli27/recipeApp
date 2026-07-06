import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'recipe-app-dev-secret';

// Dashboard için istatistik endpoint'i
export async function getStats(_req, res) {
  try {
    const [userCount, recipeCount, shoppingListCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM recipes'),
      pool.query('SELECT COUNT(*) FROM shopping_lists')
    ]);
    res.json({
      userCount: Number(userCount.rows[0].count),
      recipeCount: Number(recipeCount.rows[0].count),
      shoppingListCount: Number(shoppingListCount.rows[0].count)
    });
  } catch (error) {
    res.status(500).json({ message: 'İstatistikler alınamadı.' });
  }
}

export function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Giris yapman gerekiyor.' });
  const token = auth.slice('Bearer '.length).trim();
  try {
    const payload = jwt.verify(token, jwtSecret);
    if (payload.role !== 'admin') return res.status(403).json({ message: 'Yetkisiz.' });
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ message: 'Oturum gecersiz veya suresi dolmus.' });
  }
}

export async function listUsers(_req, res) {
  try {
    const result = await pool.query('SELECT id, full_name, email, role FROM users ORDER BY id DESC');
    res.json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcılar alınamadı.' });
  }
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz kullanıcı id.' });
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı silinemedi.' });
  }
}

export async function updateUser(req, res) {
  const id = Number(req.params.id);
  const { fullName, email, role } = req.body;
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz kullanıcı id.' });
  if (!fullName || !email || !role) return res.status(400).json({ message: 'Eksik bilgi.' });
  try {
    await pool.query(
      'UPDATE users SET full_name = $1, email = $2, role = $3 WHERE id = $4',
      [fullName, email, role, id]
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı güncellenemedi.' });
  }
}

export async function listRecipes(_req, res) {
  try {
    const result = await pool.query(`
      SELECT
        r.id, r.title, r.description, r.difficulty,
        COALESCE(SUM(vh.cooked_count), 0)::int AS "cookedTotal",
        ROUND(AVG(rr.rating)::numeric, 1) AS "avgRating",
        COUNT(DISTINCT rr.user_id)::int AS "ratingCount",
        COUNT(DISTINCT rn.user_id)::int AS "noteCount"
      FROM recipes r
      LEFT JOIN view_history vh ON vh.recipe_id = r.id
      LEFT JOIN recipe_ratings rr ON rr.recipe_id = r.id
      LEFT JOIN recipe_notes rn ON rn.recipe_id = r.id AND rn.note != ''
      GROUP BY r.id
      ORDER BY r.id DESC
    `);
    res.json({ recipes: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Tarifler alınamadı.' });
  }
}

export async function deleteRecipe(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
  try {
    await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Tarif silinemedi.' });
  }
}

export async function updateRecipe(req, res) {
  const id = Number(req.params.id);
  const { title, description, difficulty, tags } = req.body;
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
  if (!title || !description || !difficulty) return res.status(400).json({ message: 'Eksik bilgi.' });
  const tagsArray = Array.isArray(tags) ? tags : [];
  try {
    await pool.query(
      'UPDATE recipes SET title = $1, description = $2, difficulty = $3, tags = $4 WHERE id = $5',
      [title, description, difficulty, tagsArray, id]
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Tarif güncellenemedi.' });
  }
}

export async function getRecipeNotes(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
  try {
    const result = await pool.query(
      `SELECT u.full_name, u.email, rn.note, rn.updated_at
       FROM recipe_notes rn
       JOIN users u ON u.id = rn.user_id
       WHERE rn.recipe_id = $1 AND rn.note != ''
       ORDER BY rn.updated_at DESC`,
      [id]
    );
    const ratings = await pool.query(
      `SELECT u.full_name, u.email, rr.rating
       FROM recipe_ratings rr
       JOIN users u ON u.id = rr.user_id
       WHERE rr.recipe_id = $1
       ORDER BY rr.rating DESC`,
      [id]
    );
    res.json({ notes: result.rows, ratings: ratings.rows });
  } catch (error) {
    res.status(500).json({ message: 'Notlar alınamadı.' });
  }
}

export async function getUserActivity(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz kullanıcı id.' });
  try {
    const [notesResult, ratingsResult, cookedResult] = await Promise.all([
      pool.query(
        `SELECT r.id AS recipe_id, r.title, rn.note, rn.updated_at
         FROM recipe_notes rn
         JOIN recipes r ON r.id = rn.recipe_id
         WHERE rn.user_id = $1 AND rn.note != ''
         ORDER BY rn.updated_at DESC`,
        [id]
      ),
      pool.query(
        `SELECT r.id AS recipe_id, r.title, rr.rating
         FROM recipe_ratings rr
         JOIN recipes r ON r.id = rr.recipe_id
         WHERE rr.user_id = $1
         ORDER BY rr.rating DESC`,
        [id]
      ),
      pool.query(
        `SELECT r.id AS recipe_id, r.title, vh.cooked_count, vh.last_viewed_at
         FROM view_history vh
         JOIN recipes r ON r.id = vh.recipe_id
         WHERE vh.user_id = $1 AND vh.cooked_count > 0
         ORDER BY vh.cooked_count DESC`,
        [id]
      ),
    ]);
    res.json({ notes: notesResult.rows, ratings: ratingsResult.rows, cooked: cookedResult.rows });
  } catch (error) {
    res.status(500).json({ message: 'Kullanıcı aktivitesi alınamadı.' });
  }
}

// Rapor 1: Kategoriye göre tarif dağılımı + yüzdesi
export async function getCategoryStats(_req, res) {
  try {
    const result = await pool.query(`
      SELECT
        c.name AS kategori,
        COUNT(r.id) AS sayi,
        ROUND(COUNT(r.id) * 100.0 / SUM(COUNT(r.id)) OVER (), 1) AS yuzde
      FROM recipes r
      JOIN categories c ON c.id = r.category_id
      GROUP BY c.name
      ORDER BY sayi DESC
    `);
    res.json({ stats: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Kategori istatistikleri alınamadı.' });
  }
}

// Rapor 2: En çok favorilenen 10 tarif
export async function getTopFavorites(_req, res) {
  try {
    const result = await pool.query(`
      SELECT
        r.title,
        c.name AS kategori,
        COUNT(f.recipe_id) AS favori_sayisi,
        RANK() OVER (ORDER BY COUNT(f.recipe_id) DESC) AS sira
      FROM recipes r
      JOIN categories c ON c.id = r.category_id
      LEFT JOIN favorites f ON f.recipe_id = r.id
      GROUP BY r.title, c.name
      ORDER BY sira
      LIMIT 10
    `);
    res.json({ recipes: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Favori istatistikleri alınamadı.' });
  }
}

// Rapor 3: Son 7 günlük görüntülenme
export async function getDailyViews(_req, res) {
  try {
    const result = await pool.query(`
      SELECT
        DATE_TRUNC('day', last_viewed_at)::date AS gun,
        COUNT(*) AS goruntuleme
      FROM view_history
      WHERE last_viewed_at >= now() - interval '7 days'
      GROUP BY gun
      ORDER BY gun
    `);
    res.json({ views: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Günlük görüntülenme alınamadı.' });
  }
}

export async function updateRecipeSteps(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
  const { steps } = req.body;
  if (!Array.isArray(steps) || steps.length === 0) return res.status(400).json({ message: 'steps dizisi zorunlu.' });
  try {
    await pool.query('DELETE FROM recipe_steps WHERE recipe_id = $1', [id]);
    for (let i = 0; i < steps.length; i++) {
      await pool.query(
        'INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)',
        [id, i + 1, String(steps[i]).trim()]
      );
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Adımlar güncellenemedi.' });
  }
}

export async function createRecipe(req, res) {
  const { title, description, difficulty, categoryId, ingredients, steps } = req.body;
  if (!title || !description || !difficulty || !categoryId) {
    return res.status(400).json({ message: 'title, description, difficulty ve categoryId zorunlu.' });
  }
  const validDifficulties = ['kolay', 'orta', 'zor'];
  const normalizedDifficulty = typeof difficulty === 'string' ? difficulty.toLowerCase().trim() : '';
  if (!validDifficulties.includes(normalizedDifficulty)) {
    return res.status(400).json({ message: 'Geçersiz zorluk seviyesi.' });
  }
  const catId = Number(categoryId);
  if (!Number.isInteger(catId) || catId <= 0) {
    return res.status(400).json({ message: 'Geçersiz kategori id.' });
  }
  try {
    const recipeResult = await pool.query(
      'INSERT INTO recipes (title, description, difficulty, category_id, prep_time_minutes, cook_time_minutes, base_servings) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [String(title).trim(), String(description).trim(), normalizedDifficulty, catId, 15, 30, 4]
    );
    const recipeId = recipeResult.rows[0].id;
    if (Array.isArray(ingredients)) {
      for (const ing of ingredients) {
        let name, amount, unit;
        if (typeof ing === 'object' && ing !== null) {
          name = String(ing.name || '').trim();
          amount = parseFloat(ing.amount) || 1;
          unit = String(ing.unit || 'adet').trim() || 'adet';
        } else {
          name = String(ing).trim();
          amount = 1;
          unit = 'adet';
        }
        if (name) {
          await pool.query(
            'INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES ($1, $2, $3, $4)',
            [recipeId, name, amount, unit]
          );
        }
      }
    }
    if (Array.isArray(steps)) {
      for (let i = 0; i < steps.length; i++) {
        const instruction = typeof steps[i] === 'string' ? steps[i].trim() : String(steps[i]).trim();
        if (instruction) {
          await pool.query(
            'INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)',
            [recipeId, i + 1, instruction]
          );
        }
      }
    }
    res.status(201).json({ ok: true, id: recipeId });
  } catch (error) {
    res.status(500).json({ message: 'Tarif kaydedilemedi.' });
  }
}