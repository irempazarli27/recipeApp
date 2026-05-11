import pool from '../config/db.js';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export async function getWeeklyPlan(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT wp.day_of_week, r.id, r.title, r.description, r.difficulty, c.name AS category
       FROM weekly_plan wp
       LEFT JOIN recipes r ON r.id = wp.recipe_id
       LEFT JOIN categories c ON c.id = r.category_id
       WHERE wp.user_id = $1
         AND wp.week_start = date_trunc('week', CURRENT_DATE)::date
       ORDER BY wp.day_of_week`,
      [req.userId]
    );
    const plan = DAYS.map((name, i) => {
      const row = rows.find(r => r.day_of_week === i);
      return { day: i, name, recipe: row ? { id: row.id, title: row.title, description: row.description, difficulty: row.difficulty, category: row.category } : null };
    });
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: 'Haftalık plan alınamadı.' });
  }
}

export async function setDay(req, res) {
  const day = Number(req.params.day);
  const recipeId = Number(req.body.recipeId);
  if (!Number.isInteger(day) || day < 0 || day > 6) return res.status(400).json({ message: 'Geçersiz gün.' });
  if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif.' });
  try {
    await pool.query(
      `INSERT INTO weekly_plan (user_id, day_of_week, recipe_id, week_start)
       VALUES ($1, $2, $3, date_trunc('week', CURRENT_DATE)::date)
       ON CONFLICT (user_id, day_of_week, week_start) DO UPDATE SET recipe_id = $3`,
      [req.userId, day, recipeId]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Gün ayarlanamadı.' });
  }
}

export async function clearDay(req, res) {
  const day = Number(req.params.day);
  if (!Number.isInteger(day) || day < 0 || day > 6) return res.status(400).json({ message: 'Geçersiz gün.' });
  try {
    await pool.query(
      `DELETE FROM weekly_plan WHERE user_id = $1 AND day_of_week = $2
         AND week_start = date_trunc('week', CURRENT_DATE)::date`,
      [req.userId, day]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: 'Gün silinemedi.' });
  }
}
