import express from 'express';
import {
  getBookReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleLikeReview,
  getMyReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/book/:isbn', getBookReviews);

// Protected routes
router.post('/', protect, createReview);
router.get('/my-reviews', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/like', protect, toggleLikeReview);

export default router;

