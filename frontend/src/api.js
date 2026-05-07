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
		const msg = (data && (data.message || data.error)) || 'API error';
		throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
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

export function suggestRecipes({ ingredients, category, difficulty, title, tag }) {
	return apiFetch('/recipes/suggest', {
		method: 'POST',
		body: JSON.stringify({ ingredients, category, difficulty, title, tag: tag || '' })
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

// Ratings
export function getRecipeRating(recipeId) {
	return apiFetch(`/recipes/${recipeId}/rating`);
}

export function rateRecipe(recipeId, rating) {
	return apiFetch(`/recipes/${recipeId}/rating`, { method: 'POST', body: JSON.stringify({ rating }) });
}

// Notes
export function getRecipeNote(recipeId) {
	return apiFetch(`/recipes/${recipeId}/note`);
}

export function saveRecipeNote(recipeId, note) {
	return apiFetch(`/recipes/${recipeId}/note`, { method: 'PUT', body: JSON.stringify({ note }) });
}

// History
export function getHistory() {
	return apiFetch('/me/history');
}

export function markRecipeCooked(recipeId) {
	return apiFetch(`/me/history/${recipeId}/cooked`, { method: 'POST' });
}

// Wishlist
export function getWishlist() {
	return apiFetch('/me/wishlist');
}

export function addToWishlist(recipeId) {
	return apiFetch('/me/wishlist', { method: 'POST', body: JSON.stringify({ recipeId }) });
}

export function removeFromWishlist(recipeId) {
	return apiFetch(`/me/wishlist/${recipeId}`, { method: 'DELETE' });
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

export function createShoppingListFromRecipe(recipeId) {
	return apiFetch(`/me/shopping-lists/from-recipe/${recipeId}`, { method: 'POST' });
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

export function getAdminRecipeNotes(id) {
	return apiFetch(`/admin/recipes/${id}/notes`);
}

export function getAdminUserActivity(id) {
	return apiFetch(`/admin/users/${id}/activity`);
}

export function deleteAdminRecipe(id) {
	return apiFetch(`/admin/recipes/${id}`, { method: 'DELETE' });
}

export function updateAdminRecipe(id, data) {
	return apiFetch(`/admin/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function updateAdminRecipeSteps(id, steps) {
	return apiFetch(`/admin/recipes/${id}/steps`, { method: 'PUT', body: JSON.stringify({ steps }) });
}

// Raporlar
export function getReportCategories() {
	return apiFetch('/admin/reports/categories');
}
export function getReportTopFavorites() {
	return apiFetch('/admin/reports/top-favorites');
}
export function getReportDailyViews() {
	return apiFetch('/admin/reports/daily-views');
}

// AI
export function aiGetDailyRecipes() {
	return apiFetch('/ai/daily');
}

export function aiSuggestRecipes(ingredients, title) {
	return apiFetch('/ai/suggest', { method: 'POST', body: JSON.stringify({ ingredients, title }) });
}

export function aiGetRecipeDetail(name) {
	return apiFetch('/ai/recipe', { method: 'POST', body: JSON.stringify({ name }) });
}

export function aiTransformRecipe(recipeId, transformation) {
	return apiFetch('/ai/transform', { method: 'POST', body: JSON.stringify({ recipeId, transformation }) });
}

export function aiWeeklyPlan() {
	return apiFetch('/ai/weekly-plan', { method: 'POST' });
}

export function getSimilarRecipes(id) {
	return apiFetch(`/recipes/${id}/similar`);
}

export function getWeeklyPlan() {
	return apiFetch('/me/weekly-plan');
}

export function setWeeklyPlanDay(day, recipeId) {
	return apiFetch(`/me/weekly-plan/${day}`, { method: 'PUT', body: JSON.stringify({ recipeId }) });
}

export function clearWeeklyPlanDay(day) {
	return apiFetch(`/me/weekly-plan/${day}`, { method: 'DELETE' });
}

export function adminCreateRecipe({ title, description, difficulty, categoryId, ingredients, steps }) {
	return apiFetch('/admin/recipes', { method: 'POST', body: JSON.stringify({ title, description, difficulty, categoryId, ingredients, steps }) });
}

export default apiFetch;
