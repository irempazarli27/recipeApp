import express from 'express';
import * as favoriteController from '../controllers/favoriteController.js';

const router = express.Router();

router.get('/', favoriteController.requireAuth, favoriteController.listFavorites);
router.post('/', favoriteController.requireAuth, favoriteController.addFavorite);
router.delete('/:recipeId', favoriteController.requireAuth, favoriteController.removeFavorite);

export default router;
