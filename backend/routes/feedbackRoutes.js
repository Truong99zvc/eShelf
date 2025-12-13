import express from 'express';
import {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect, optionalAuth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (optionally authenticated)
router.post('/', optionalAuth, createFeedback);

// Protected routes
router.get('/my-feedback', protect, getMyFeedback);

// Admin routes
router.get('/', protect, admin, getAllFeedback);
router.put('/:id', protect, admin, updateFeedback);
router.delete('/:id', protect, admin, deleteFeedback);

export default router;

