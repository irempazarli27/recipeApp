import pool from '../config/db.js';

export async function getWishlist(req, res) {
	try {
		const result = await pool.query(
			`SELECT r.id, r.title, r.description, r.difficulty, c.name AS category, rw.added_at AS "addedAt"
			 FROM recipe_wishlist rw
			 JOIN recipes r ON r.id = rw.recipe_id
			 JOIN categories c ON c.id = r.category_id
			 WHERE rw.user_id = $1
			 ORDER BY rw.added_at DESC`,
			[req.userId]
		);
		res.json({ wishlist: result.rows });
	} catch (err) {
		res.status(500).json({ message: 'Liste alınamadı.' });
	}
}

export async function addToWishlist(req, res) {
	const recipeId = Number(req.body.recipeId);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		await pool.query(
			`INSERT INTO recipe_wishlist (user_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
			[req.userId, recipeId]
		);
		res.json({ ok: true });
	} catch (err) {
		res.status(500).json({ message: 'Eklenemedi.' });
	}
}

export async function removeFromWishlist(req, res) {
	const recipeId = Number(req.params.id);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		await pool.query(
			`DELETE FROM recipe_wishlist WHERE user_id = $1 AND recipe_id = $2`,
			[req.userId, recipeId]
		);
		res.json({ ok: true });
	} catch (err) {
		res.status(500).json({ message: 'Silinemedi.' });
	}
}
