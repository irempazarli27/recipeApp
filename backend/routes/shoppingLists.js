import express from 'express';
import * as shoppingListController from '../controllers/shoppingListController.js';

const router = express.Router();

router.get('/', shoppingListController.requireAuth, shoppingListController.listShoppingLists);
router.post('/', shoppingListController.requireAuth, shoppingListController.addShoppingList);
router.get('/:id', shoppingListController.requireAuth, shoppingListController.getShoppingListDetail);
router.delete('/:id', shoppingListController.requireAuth, shoppingListController.deleteShoppingList);
router.post('/:id/items', shoppingListController.requireAuth, shoppingListController.addShoppingListItem);
router.delete('/:listId/items/:itemId', shoppingListController.requireAuth, shoppingListController.deleteShoppingListItem);
router.post('/from-recipe/:recipeId', shoppingListController.requireAuth, shoppingListController.createShoppingListFromRecipe);

export default router;
