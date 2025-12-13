import express from 'express';
import {
  createDonation,
  getMyDonations,
  checkDonationStatus,
  getAllDonations,
  updateDonationStatus,
} from '../controllers/donationController.js';
import { protect, optionalAuth, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', optionalAuth, createDonation);
router.get('/status/:transactionId', checkDonationStatus);

// Protected routes
router.get('/my-donations', protect, getMyDonations);

// Admin routes
router.get('/', protect, admin, getAllDonations);
router.put('/:id', protect, admin, updateDonationStatus);

export default router;

