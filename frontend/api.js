// Merkezi API istemcisi
const BASE_URL = '/api';

async function apiFetch(path, options = {}) {
	const url = BASE_URL + path;
	const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
	const opts = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers || {})
		},
	};
	const res = await fetch(url, opts);
	const contentType = res.headers.get('content-type');
	let data = null;
	if (contentType && contentType.includes('application/json')) {
		data = await res.json();
	} else {
		data = await res.text();
	}
	if (!res.ok) {
		throw data && data.message ? new Error(data.message) : new Error('API error');
	}
	return data;
}

// Auth
export function registerUser({ fullName, email, password }) {
	return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ fullName, email, password }) });
}

export function loginUser({ email, password }) {
	return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function getCurrentUser() {
	return apiFetch('/auth/me');
}

// Recipes
export function getRecipes() {
	return apiFetch('/recipes');
}

export function getPopularRecipes() {
	return apiFetch('/recipes/popular');
}

export function getRecipeDetail(id) {
	return apiFetch(`/recipes/${id}`);
}

export function suggestRecipes({ ingredients, category, difficulty, title }) {
	return apiFetch('/recipes/suggest', {
		method: 'POST',
		body: JSON.stringify({ ingredients, category, difficulty, title })
	});
}

// Favorites
export function getFavorites() {
	return apiFetch('/me/favorites');
}

export function addFavorite(recipeId) {
	return apiFetch('/me/favorites', { method: 'POST', body: JSON.stringify({ recipeId }) });
}

export function removeFavorite(recipeId) {
	return apiFetch(`/me/favorites/${recipeId}`, { method: 'DELETE' });
}

// History
export function getHistory() {
	return apiFetch('/me/history');
}

// Shopping Lists
export function getShoppingLists() {
	return apiFetch('/me/shopping-lists');
}

export function createShoppingList(title) {
	return apiFetch('/me/shopping-lists', { method: 'POST', body: JSON.stringify({ title }) });
}

export function getShoppingListDetail(id) {
	return apiFetch(`/me/shopping-lists/${id}`);
}

export function deleteShoppingList(id) {
	return apiFetch(`/me/shopping-lists/${id}`, { method: 'DELETE' });
}

export function addShoppingListItem(listId, { name, amount, unit }) {
	return apiFetch(`/me/shopping-lists/${listId}/items`, { method: 'POST', body: JSON.stringify({ name, amount, unit }) });
}

export function deleteShoppingListItem(listId, itemId) {
	return apiFetch(`/me/shopping-lists/${listId}/items/${itemId}`, { method: 'DELETE' });
}

// Admin
export function getAdminStats() {
	return apiFetch('/admin/stats');
}

export function getAdminUsers() {
	return apiFetch('/admin/users');
}

export function deleteAdminUser(id) {
	return apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
}

export function getAdminRecipes() {
	return apiFetch('/admin/recipes');
}

export function deleteAdminRecipe(id) {
	return apiFetch(`/admin/recipes/${id}`, { method: 'DELETE' });
}

export function updateAdminRecipe(id, data) {
	return apiFetch(`/admin/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export default apiFetch;
