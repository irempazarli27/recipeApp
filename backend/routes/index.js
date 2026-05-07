// Tüm route'ları ana uygulamaya bağlar
import authRoutes from './auth.js';
import recipeRoutes from './recipes.js';
import favoriteRoutes from './favorites.js';
import shoppingListRoutes from './shoppingLists.js';
import historyRoutes from './history.js';
import adminRoutes from './admin.js';
import aiRoutes from './ai.js';
import wishlistRoutes from './wishlist.js';
import weeklyPlanRoutes from './weeklyPlan.js';

export default function routes(app) {
  app.use('/api/auth', authRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/me/favorites', favoriteRoutes);
  app.use('/api/me/shopping-lists', shoppingListRoutes);
  app.use('/api/me/history', historyRoutes);
  app.use('/api/me/wishlist', wishlistRoutes);
  app.use('/api/me/weekly-plan', weeklyPlanRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);
}
