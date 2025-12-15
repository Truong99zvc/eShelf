import express from 'express';
import {
  updateProfile,
  addFavorite,
  removeFavorite,
  getFavorites,
  addBookmark,
  removeBookmark,
  getBookmarks,
  updateReadingHistory,
  getReadingHistory,
  getUsers,
  toggleUserActive,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile
router.put('/profile', updateProfile);

// Favorites
router.get('/favorites', getFavorites);
router.post('/favorites/:isbn', addFavorite);
router.delete('/favorites/:isbn', removeFavorite);

// Bookmarks
router.get('/bookmarks', getBookmarks);
router.post('/bookmarks/:isbn', addBookmark);
router.delete('/bookmarks/:isbn', removeBookmark);

// Reading history
router.get('/reading-history', getReadingHistory);
router.post('/reading-history/:isbn', updateReadingHistory);

// Admin routes
router.get('/', admin, getUsers);
router.put('/:id/toggle-active', admin, toggleUserActive);

export default router;










