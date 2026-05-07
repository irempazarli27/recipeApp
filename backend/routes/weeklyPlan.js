import { Router } from 'express';
import { requireAuth } from '../controllers/authController.js';
import * as weeklyPlanController from '../controllers/weeklyPlanController.js';

const router = Router();

router.get('/', requireAuth, weeklyPlanController.getWeeklyPlan);
router.put('/:day', requireAuth, weeklyPlanController.setDay);
router.delete('/:day', requireAuth, weeklyPlanController.clearDay);

export default router;
