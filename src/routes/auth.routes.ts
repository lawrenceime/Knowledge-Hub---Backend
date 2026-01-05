import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Auth Routes

// Register
router.post('/register', authController.register);
// Login
router.post('/login', authController.login);
// Forgot Password
router.post('/forgot-password', authController.forgotPassword);
// Reset Password
router.post('/reset-password/:token', authController.resetPassword);

export default router;