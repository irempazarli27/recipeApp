import express from 'express';
import * as historyController from '../controllers/historyController.js';

const router = express.Router();

router.get('/', historyController.requireAuth, historyController.getHistory);
router.post('/:id/cooked', historyController.requireAuth, historyController.markCooked);

export default router;
