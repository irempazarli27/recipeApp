import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { requireAuth } from '../controllers/authController.js';

const router = express.Router();

router.get('/', requireAuth, wishlistController.getWishlist);
router.post('/', requireAuth, wishlistController.addToWishlist);
router.delete('/:id', requireAuth, wishlistController.removeFromWishlist);

export default router;
