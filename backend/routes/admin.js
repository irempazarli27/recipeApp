import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', adminController.requireAdmin, adminController.listUsers);
router.get('/users/:id/activity', adminController.requireAdmin, adminController.getUserActivity);
router.delete('/users/:id', adminController.requireAdmin, adminController.deleteUser);
router.put('/users/:id', adminController.requireAdmin, adminController.updateUser);


// Dashboard için istatistik endpoint'i
router.get('/stats', adminController.requireAdmin, adminController.getStats);

router.get('/recipes', adminController.requireAdmin, adminController.listRecipes);
router.get('/recipes/:id/notes', adminController.requireAdmin, adminController.getRecipeNotes);
router.post('/recipes', adminController.requireAdmin, adminController.createRecipe);
router.delete('/recipes/:id', adminController.requireAdmin, adminController.deleteRecipe);
router.put('/recipes/:id', adminController.requireAdmin, adminController.updateRecipe);
router.put('/recipes/:id/steps', adminController.requireAdmin, adminController.updateRecipeSteps);

router.get('/reports/categories', adminController.requireAdmin, adminController.getCategoryStats);
router.get('/reports/top-favorites', adminController.requireAdmin, adminController.getTopFavorites);
router.get('/reports/daily-views', adminController.requireAdmin, adminController.getDailyViews);

export default router;