import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

export default router;

