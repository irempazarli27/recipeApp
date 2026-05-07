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

export async function listFavorites(req, res) {
	try {
		const result = await pool.query(
			`
			SELECT
				r.id,
				r.title,
				r.description,
				r.difficulty,
				c.name AS category,
				f.created_at AS "createdAt"
			FROM favorites f
			JOIN recipes r ON r.id = f.recipe_id
			JOIN categories c ON c.id = r.category_id
			WHERE f.user_id = $1
			ORDER BY f.created_at DESC
			`,
			[req.userId]
		);
		return res.json({ favorites: result.rows });
	} catch (error) {
		console.error('favorites list error:', error);
		return res.status(500).json({ message: 'Favoriler alinamadi.' });
	}
}

export async function addFavorite(req, res) {
	const recipeId = Number(req.body?.recipeId);
	if (!Number.isInteger(recipeId) || recipeId <= 0) {
		return res.status(400).json({ message: 'Gecersiz recipeId.' });
	}
	try {
		const recipeResult = await pool.query(
			'SELECT id FROM recipes WHERE id = $1 LIMIT 1',
			[recipeId]
		);
		if (recipeResult.rows.length === 0) {
			return res.status(404).json({ message: 'Tarif bulunamadi.' });
		}
		await pool.query(
			`
			INSERT INTO favorites (user_id, recipe_id)
			VALUES ($1, $2)
			ON CONFLICT (user_id, recipe_id) DO NOTHING
			`,
			[req.userId, recipeId]
		);
		return res.status(201).json({ ok: true });
	} catch (error) {
		console.error('favorites add error:', error);
		return res.status(500).json({ message: 'Favoriye eklenemedi.' });
	}
}

export async function removeFavorite(req, res) {
	const recipeId = Number(req.params.recipeId);
	if (!Number.isInteger(recipeId) || recipeId <= 0) {
		return res.status(400).json({ message: 'Gecersiz recipeId.' });
	}
	try {
		await pool.query(
			`
			DELETE FROM favorites
			WHERE user_id = $1 AND recipe_id = $2
			`,
			[req.userId, recipeId]
		);
		return res.json({ ok: true });
	} catch (error) {
		console.error('favorites remove error:', error);
		return res.status(500).json({ message: 'Favoriden silinemedi.' });
	}
}
