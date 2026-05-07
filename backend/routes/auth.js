import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Kayıt ol
router.post('/register', authController.register);
// Giriş yap
router.post('/login', authController.login);
// Me
router.get('/me', authController.requireAuth, authController.me);

export default router;
