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

export async function listShoppingLists(req, res) {
	try {
		const result = await pool.query(
			'SELECT id, title FROM shopping_lists WHERE user_id = $1 ORDER BY id DESC',
			[req.userId]
		);
		res.json({ lists: result.rows });
	} catch (error) {
		console.error('shopping-lists list error:', error);
		res.status(500).json({ message: 'Listeler alinamadi.' });
	}
}

export async function addShoppingList(req, res) {
	const title = String(req.body?.title || '').trim();
	if (!title) return res.status(400).json({ message: 'Liste adı zorunlu.' });
	try {
		const result = await pool.query(
			'INSERT INTO shopping_lists (user_id, title) VALUES ($1, $2) RETURNING id, title',
			[req.userId, title]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error('shopping-list add error:', error);
		res.status(500).json({ message: 'Liste eklenemedi.' });
	}
}

export async function getShoppingListDetail(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz liste id.' });
	try {
		const listResult = await pool.query(
			'SELECT id, title FROM shopping_lists WHERE id = $1 AND user_id = $2',
			[id, req.userId]
		);
		if (listResult.rows.length === 0) return res.status(404).json({ message: 'Liste bulunamadi.' });
		const itemsResult = await pool.query(
			'SELECT id, name, amount, unit FROM shopping_list_items WHERE list_id = $1',
			[id]
		);
		res.json({ ...listResult.rows[0], items: itemsResult.rows });
	} catch (error) {
		console.error('shopping-list detail error:', error);
		res.status(500).json({ message: 'Liste detayi alinamadi.' });
	}
}

export async function deleteShoppingList(req, res) {
	const id = Number(req.params.id);
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz liste id.' });
	try {
		await pool.query('DELETE FROM shopping_list_items WHERE list_id = $1', [id]);
		await pool.query('DELETE FROM shopping_lists WHERE id = $1 AND user_id = $2', [id, req.userId]);
		res.json({ ok: true });
	} catch (error) {
		console.error('shopping-list delete error:', error);
		res.status(500).json({ message: 'Liste silinemedi.' });
	}
}

export async function addShoppingListItem(req, res) {
	const id = Number(req.params.id);
	const name = String(req.body?.name || '').trim();
	const amount = req.body?.amount || null;
	const unit = req.body?.unit || null;
	if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'Geçersiz liste id.' });
	if (!name) return res.status(400).json({ message: 'Ürün adı zorunlu.' });
	try {
		// Liste gerçekten bu kullanıcıya mı ait?
		const listCheck = await pool.query('SELECT id FROM shopping_lists WHERE id = $1 AND user_id = $2', [id, req.userId]);
		if (listCheck.rows.length === 0) return res.status(404).json({ message: 'Liste bulunamadi.' });
		const result = await pool.query(
			'INSERT INTO shopping_list_items (list_id, name, amount, unit) VALUES ($1, $2, $3, $4) RETURNING id, name, amount, unit',
			[id, name, amount, unit]
		);
		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error('shopping-list item add error:', error);
		res.status(500).json({ message: 'Ürün eklenemedi.' });
	}
}

export async function deleteShoppingListItem(req, res) {
	const listId = Number(req.params.listId);
	const itemId = Number(req.params.itemId);
	if (!Number.isInteger(listId) || listId <= 0 || !Number.isInteger(itemId) || itemId <= 0) return res.status(400).json({ message: 'Geçersiz id.' });
	try {
		// Liste gerçekten bu kullanıcıya mı ait?
		const listCheck = await pool.query('SELECT id FROM shopping_lists WHERE id = $1 AND user_id = $2', [listId, req.userId]);
		if (listCheck.rows.length === 0) return res.status(404).json({ message: 'Liste bulunamadi.' });
		await pool.query('DELETE FROM shopping_list_items WHERE id = $1 AND list_id = $2', [itemId, listId]);
		res.json({ ok: true });
	} catch (error) {
		console.error('shopping-list item delete error:', error);
		res.status(500).json({ message: 'Ürün silinemedi.' });
	}
}

export async function createShoppingListFromRecipe(req, res) {
	const recipeId = Number(req.params.recipeId);
	if (!Number.isInteger(recipeId) || recipeId <= 0) return res.status(400).json({ message: 'Geçersiz tarif id.' });
	try {
		// Tarif adını ve malzemeleri çek
		const recipeResult = await pool.query('SELECT title FROM recipes WHERE id = $1', [recipeId]);
		if (recipeResult.rows.length === 0) return res.status(404).json({ message: 'Tarif bulunamadı.' });
		const recipeTitle = recipeResult.rows[0].title;

		const ingredientsResult = await pool.query(
			'SELECT name, amount, unit FROM ingredients WHERE recipe_id = $1',
			[recipeId]
		);
		const ingredients = ingredientsResult.rows;
		if (ingredients.length === 0) return res.status(400).json({ message: 'Bu tarifte malzeme yok.' });

		// Alışveriş listesi oluştur
		const listResult = await pool.query(
			'INSERT INTO shopping_lists (user_id, title) VALUES ($1, $2) RETURNING id, title',
			[req.userId, recipeTitle]
		);
		const list = listResult.rows[0];

		// Malzemeleri toplu ekle
		for (const ing of ingredients) {
			await pool.query(
				'INSERT INTO shopping_list_items (list_id, name, amount, unit) VALUES ($1, $2, $3, $4)',
				[list.id, ing.name, ing.amount || null, ing.unit || null]
			);
		}

		const itemsResult = await pool.query(
			'SELECT id, name, amount, unit FROM shopping_list_items WHERE list_id = $1',
			[list.id]
		);
		res.status(201).json({ ...list, items: itemsResult.rows });
	} catch (error) {
		console.error('shopping-list from-recipe error:', error);
		res.status(500).json({ message: 'Liste oluşturulamadı.' });
	}
}
