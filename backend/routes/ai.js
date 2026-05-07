import { Router } from 'express';
import { aiSuggest, aiRecipeDetail, aiDailySuggestions, aiTransformRecipe, aiWeeklyPlan } from '../controllers/aiController.js';
import { requireAuth } from '../controllers/authController.js';

const router = Router();

// GET /api/ai/daily
router.get('/daily', aiDailySuggestions);

// POST /api/ai/suggest   { ingredients: ["domates", "soğan"] }
router.post('/suggest', aiSuggest);

// POST /api/ai/recipe    { name: "mercimek çorbası" }
router.post('/recipe', aiRecipeDetail);

// POST /api/ai/transform  { recipeId, transformation: 'vejetaryen'|'kolay'|'saglikli'|'glutensiz' }
router.post('/transform', requireAuth, aiTransformRecipe);

// POST /api/ai/weekly-plan  — AI ile haftalık menü önerisi
router.post('/weekly-plan', requireAuth, aiWeeklyPlan);

export default router;
