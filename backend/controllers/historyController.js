import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'recipe-app-dev-secret';

export function requireAuth(req, res, next) {
	const auth = req.headers.authorization || '';
	if (!auth.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Giris yapman gerekiyor.' });
	}
	const token = auth.slice('Bearer '.length).trim();
	try {
		const payload = jwt.verify(token, jwtSecret);
		req.userId = payload.userId;
		return next();
	} catch (_error) {
		return res.status(401).json({ message: 'Oturum gecersiz veya suresi dolmus.' });
	}
}

export async function getHistory(req, res) {
	try {
		const result = await pool.query(
			`SELECT r.id, r.title, r.description, r.difficulty, c.name AS category,
			        vh.last_viewed_at AS "lastViewedAt", vh.view_count AS "viewCount",
			        vh.cooked_count AS "cookedCount"
			 FROM view_history vh
			 JOIN recipes r ON r.id = vh.recipe_id
			 JOIN categories c ON c.id = r.category_id
			 WHERE vh.user_id = $1
			 ORDER BY vh.last_viewed_at DESC
			 LIMIT 50`,
			[req.userId]
		);
		res.json({ history: result.rows });
	} catch (error) {
		console.error('history error:', error);
		res.status(500).json({ message: 'Gecmis alinamadi.' });
	}
}

export async function markCooked(req, res) {
	const recipeId = Number(req.params.id);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		await pool.query(
			`INSERT INTO view_history (user_id, recipe_id, last_viewed_at, view_count, cooked_count)
			 VALUES ($1, $2, now(), 1, 1)
			 ON CONFLICT (user_id, recipe_id) DO UPDATE
			   SET cooked_count = view_history.cooked_count + 1, last_viewed_at = now()`,
			[req.userId, recipeId]
		);
		const result = await pool.query(
			`SELECT COALESCE(SUM(cooked_count), 0)::int AS "cookedCount" FROM view_history WHERE recipe_id = $1`,
			[recipeId]
		);
		res.json({ ok: true, cookedCount: result.rows[0]?.cookedCount || 1 });
	} catch (err) {
		res.status(500).json({ message: '"Yaptım" kaydedilemedi.' });
	}
}

