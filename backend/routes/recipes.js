import express from 'express';
import * as recipeController from '../controllers/recipeController.js';
import { requireAuth } from '../controllers/authController.js';

const router = express.Router();

// Statik route'lar önce tanımlanmalı (/:id'den önce)
router.get('/popular', recipeController.listPopularRecipes);
router.post('/suggest', recipeController.suggestRecipes);
router.get('/', recipeController.listRecipes);
router.get('/:id', recipeController.optionalAuth, recipeController.getRecipeDetail);
router.get('/:id/rating', recipeController.optionalAuth, recipeController.getRecipeRating);
router.post('/:id/rating', requireAuth, recipeController.rateRecipe);
router.get('/:id/similar', recipeController.getSimilarRecipes);
router.get('/:id/note', requireAuth, recipeController.getRecipeNote);
router.put('/:id/note', requireAuth, recipeController.saveRecipeNote);

export default router;
