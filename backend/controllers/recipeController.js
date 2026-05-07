import pool from '../config/db.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'recipe-app-dev-secret';

// --- PUANLAMA ---
export async function rateRecipe(req, res) {
	const recipeId = Number(req.params.id);
	const rating = Number(req.body.rating);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Puan 1-5 arasında olmalı.' });
	try {
		await pool.query(
			`INSERT INTO recipe_ratings (user_id, recipe_id, rating)
			 VALUES ($1, $2, $3)
			 ON CONFLICT (user_id, recipe_id) DO UPDATE SET rating = $3`,
			[req.userId, recipeId, rating]
		);
		const avg = await pool.query(
			`SELECT ROUND(AVG(rating)::numeric, 1) AS avg, COUNT(*) AS count FROM recipe_ratings WHERE recipe_id = $1`,
			[recipeId]
		);
		res.json({ ok: true, avg: Number(avg.rows[0].avg), count: Number(avg.rows[0].count) });
	} catch (err) {
		res.status(500).json({ message: 'Puan kaydedilemedi.' });
	}
}

export async function getRecipeRating(req, res) {
	const recipeId = Number(req.params.id);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		const avg = await pool.query(
			`SELECT ROUND(AVG(rating)::numeric, 1) AS avg, COUNT(*) AS count FROM recipe_ratings WHERE recipe_id = $1`,
			[recipeId]
		);
		const userRating = req.userId ? await pool.query(
			`SELECT rating FROM recipe_ratings WHERE user_id = $1 AND recipe_id = $2`,
			[req.userId, recipeId]
		) : { rows: [] };
		res.json({
			avg: Number(avg.rows[0].avg) || 0,
			count: Number(avg.rows[0].count),
			userRating: userRating.rows[0]?.rating || null
		});
	} catch (err) {
		res.status(500).json({ message: 'Puan alınamadı.' });
	}
}

// --- KİŞİSEL NOTLAR ---
export async function getSimilarRecipes(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz id.' });
	try {
		const { rows } = await pool.query(
			`SELECT r.id, r.title, r.description, r.difficulty, c.name AS category
			 FROM recipes r
			 LEFT JOIN categories c ON c.id = r.category_id
			 WHERE r.category_id = (SELECT category_id FROM recipes WHERE id = $1)
			   AND r.id != $1
			 ORDER BY RANDOM()
			 LIMIT 4`,
			[id]
		);
		res.json({ recipes: rows });
	} catch (err) {
		res.status(500).json({ message: 'Benzer tarifler alınamadı.' });
	}
}

export async function getRecipeNote(req, res) {
	const recipeId = Number(req.params.id);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		const result = await pool.query(
			`SELECT note FROM recipe_notes WHERE user_id = $1 AND recipe_id = $2`,
			[req.userId, recipeId]
		);
		res.json({ note: result.rows[0]?.note || '' });
	} catch (err) {
		res.status(500).json({ message: 'Not alınamadı.' });
	}
}

export async function saveRecipeNote(req, res) {
	const recipeId = Number(req.params.id);
	const note = String(req.body.note || '').slice(0, 2000);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		await pool.query(
			`INSERT INTO recipe_notes (user_id, recipe_id, note, updated_at)
			 VALUES ($1, $2, $3, now())
			 ON CONFLICT (user_id, recipe_id) DO UPDATE SET note = $3, updated_at = now()`,
			[req.userId, recipeId, note]
		);
		res.json({ ok: true });
	} catch (err) {
		res.status(500).json({ message: 'Not kaydedilemedi.' });
	}
}

// En çok favorilenen tarifleri listele
export async function listPopularRecipes(_req, res) {
	try {
		const result = await pool.query(`
			SELECT r.id, r.title, r.description, r.difficulty, COUNT(f.user_id) AS favorite_count
			FROM recipes r
			LEFT JOIN favorites f ON f.recipe_id = r.id
			GROUP BY r.id
			ORDER BY favorite_count DESC, r.title ASC
			LIMIT 10
		`);
		res.json({ recipes: result.rows });
	} catch (error) {
		res.status(500).json({ message: 'Popüler tarifler alınamadı.' });
	}
}

export async function listRecipes(req, res) {
	try {
		const title = typeof req.query.title === 'string' ? req.query.title.trim() : '';
		const limit = Math.min(Number(req.query.limit) || 200, 200);
		const params = [];
		let where = '';
		if (title) {
			params.push(`%${title}%`);
			where = `WHERE unaccent(lower(r.title)) ILIKE unaccent(lower($1))`;
		}
		params.push(limit);
		const result = await pool.query(
			`SELECT r.id, r.title, r.description, r.difficulty, c.name AS category
			 FROM recipes r
			 JOIN categories c ON c.id = r.category_id
			 ${where}
			 ORDER BY r.title ASC
			 LIMIT $${params.length}`,
			params
		);
		return res.json({ recipes: result.rows });
	} catch (error) {
		console.error('recipes list error:', error && error.stack ? error.stack : error);
		return res.status(500).json({ message: 'Tarifler alinamadi.', error: error && error.message ? error.message : String(error) });
	}
}

export function optionalAuth(req, _res, next) {
	const auth = req.headers.authorization || '';
	if (!auth.startsWith('Bearer ')) {
		req.userId = null;
		return next();
	}
	const token = auth.slice('Bearer '.length).trim();
	try {
		const payload = jwt.verify(token, jwtSecret);
		req.userId = payload.userId;
		return next();
	} catch (_error) {
		req.userId = null;
		return next();
	}
}

export async function getRecipeDetail(req, res) {
	const recipeId = Number(req.params.id);
	if (!Number.isInteger(recipeId) || recipeId <= 0) {
		return res.status(400).json({ message: 'Gecersiz tarif id.' });
	}
	try {
		const recipeResult = await pool.query(
			`
			SELECT r.id, r.title, r.description, r.difficulty, c.name AS category, r.tags
			FROM recipes r
			JOIN categories c ON c.id = r.category_id
			WHERE r.id = $1
			`,
			[recipeId]
		);
		if (recipeResult.rows.length === 0) {
			return res.status(404).json({ message: 'Tarif bulunamadi.' });
		}
		const ingredientsResult = await pool.query(
			`
			SELECT id, name, amount, unit, notes
			FROM ingredients
			WHERE recipe_id = $1
			ORDER BY id ASC
			`,
			[recipeId]
		);
		const stepsResult = await pool.query(
			`
			SELECT id, step_number, instruction
			FROM recipe_steps
			WHERE recipe_id = $1
			ORDER BY step_number ASC
			`,
			[recipeId]
		);
		if (req.userId) {
			try {
				await pool.query(
					`
					INSERT INTO view_history (user_id, recipe_id, last_viewed_at, view_count)
					VALUES ($1, $2, now(), 1)
					ON CONFLICT (user_id, recipe_id)
					DO UPDATE SET
						last_viewed_at = now(),
						view_count = view_history.view_count + 1
					`,
					[req.userId, recipeId]
				);
			} catch (historyError) {
				console.error('history write error:', historyError);
			}
		}
		const cookedRow = req.userId
			? (await pool.query(
				`SELECT cooked_count FROM view_history WHERE user_id = $1 AND recipe_id = $2`,
				[req.userId, recipeId]
			)).rows[0]
			: null;
		const totalCooked = (await pool.query(
			`SELECT COALESCE(SUM(cooked_count), 0)::int AS total FROM view_history WHERE recipe_id = $1`,
			[recipeId]
		)).rows[0]?.total || 0;
		return res.json({
			recipe: {
				...recipeResult.rows[0],
				ingredients: ingredientsResult.rows,
				steps: stepsResult.rows,
				cookedByMe: (cookedRow?.cooked_count || 0) > 0,
				cookedCount: totalCooked
			}
		});
	} catch (error) {
		console.error('detail error:', error);
		return res.status(500).json({ message: 'Tarif detayi alinirken hata olustu.' });
	}
}

export async function suggestRecipes(req, res) {
	const rawIngredients = Array.isArray(req.body?.ingredients)
		? req.body.ingredients
		: [];
	const category = String(req.body?.category || '').trim().toLowerCase();
	const difficulty = String(req.body?.difficulty || '').trim().toLowerCase();
	const title = String(req.body?.title || '').trim().toLowerCase();
	const allowedDifficulties = new Set(['kolay', 'orta', 'zor']);

	const tag = String(req.body?.tag || '').trim().toLowerCase();

	const ingredients = rawIngredients
		.map((item) => String(item).trim().toLowerCase())
		.filter(Boolean);

	const emptySearch = ingredients.length === 0 && !title;
	const queryIngredients = ingredients;

	if (difficulty && !allowedDifficulties.has(difficulty)) {
		return res.status(400).json({
			message: 'difficulty alani kolay, orta veya zor olmali.'
		});
	}

	// Boş arama: tüm tarifleri kategori/zorluk filtresiyle listele
	if (emptySearch) {
		try {
			const result = await pool.query(
				`SELECT r.id, r.title, r.description, r.difficulty, c.name AS category
				 FROM recipes r
				 JOIN categories c ON c.id = r.category_id
				 WHERE ($1::text = '' OR c.slug = $1::text)
				   AND ($2::text = '' OR r.difficulty = $2::text)
			   AND ($3::text = '' OR $3 = ANY(r.tags))
			 ORDER BY r.title ASC
			 LIMIT 50`,
			[category, difficulty, tag]
			);
			return res.json({ recipes: result.rows });
		} catch (error) {
			console.error('suggest all error:', error);
			return res.status(500).json({ message: 'Tarifler alınamadı.' });
		}
	}

	const sql = `
		WITH input_items AS (
			SELECT DISTINCT unnest($1::text[]) AS name
		),
		recipe_totals AS (
			SELECT
				i.recipe_id,
				COUNT(DISTINCT lower(i.name)) AS total_count
			FROM ingredients i
			GROUP BY i.recipe_id
		),
		recipe_matches AS (
			SELECT
				i.recipe_id,
				COUNT(DISTINCT lower(i.name)) AS matched_count
			FROM ingredients i
			JOIN input_items inp ON lower(i.name) LIKE '%' || inp.name || '%'
			GROUP BY i.recipe_id
		)
		SELECT
			r.id,
			r.title,
			r.description,
			ROUND((COALESCE(rm.matched_count, 0) * 100.0) / NULLIF(rt.total_count, 0))::int AS "matchRate",
			rt.total_count AS "totalIngredients",
			COALESCE(rm.matched_count, 0) AS "matchedCount",
			(rt.total_count - COALESCE(rm.matched_count, 0)) AS "missingCount"
		FROM recipes r
		JOIN categories c ON c.id = r.category_id
		LEFT JOIN recipe_totals rt ON rt.recipe_id = r.id
		LEFT JOIN recipe_matches rm ON rm.recipe_id = r.id
		WHERE ($2::text = '' OR c.slug = $2::text)
			AND ($3::text = '' OR r.difficulty = $3::text)
			AND ($4::text = '' OR lower(r.title) LIKE '%' || $4::text || '%')
			AND ($5::text = '' OR $5 = ANY(r.tags))
			AND ((array_length($1::text[], 1) IS NULL OR array_length($1::text[], 1) = 0) OR rm.matched_count IS NOT NULL OR $4::text != '')
		ORDER BY COALESCE(rm.matched_count, 0) DESC, "matchRate" DESC, r.title ASC
		LIMIT 20;
	`;

	try {
		const result = await pool.query(sql, [queryIngredients, category, difficulty, title, tag]);
		return res.json({ recipes: result.rows });
	} catch (error) {
		console.error('suggest error:', error && error.stack ? error.stack : error);
		return res.status(500).json({
			message: 'Tarif onerisi alinirken hata olustu.',
			error: error && error.message ? error.message : String(error)
		});
	}
}

// --- ADMIN ---
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

export async function adminListRecipes(_req, res) {
	try {
		const result = await pool.query('SELECT id, title, description, difficulty FROM recipes ORDER BY id DESC');
		res.json({ recipes: result.rows });
	} catch (error) {
		res.status(500).json({ message: 'Tarifler alınamadı.' });
	}
}

export async function adminDeleteRecipe(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		await pool.query('DELETE FROM recipes WHERE id = $1', [id]);
		res.json({ ok: true });
	} catch (error) {
		res.status(500).json({ message: 'Tarif silinemedi.' });
	}
}

export async function adminUpdateRecipe(req, res) {
	const id = Number(req.params.id);
	const { title, description, difficulty } = req.body;
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	if (!title || !description || !difficulty) return res.status(400).json({ message: 'Eksik bilgi.' });
	try {
		await pool.query(
			'UPDATE recipes SET title = $1, description = $2, difficulty = $3 WHERE id = $4',
			[title, description, difficulty, id]
		);
		res.json({ ok: true });
	} catch (error) {
		res.status(500).json({ message: 'Tarif güncellenemedi.' });
	}
}
