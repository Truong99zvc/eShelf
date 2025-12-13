import express from 'express';
import {
  getBooks,
  getBookByIsbn,
  getRelatedBooks,
  searchBooks,
  getGenres,
  getBooksByGenre,
  incrementDownload,
  createBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/genres', getGenres);
router.get('/genre/:genreName', getBooksByGenre);
router.get('/:isbn', getBookByIsbn);
router.get('/:isbn/related', getRelatedBooks);
router.post('/:isbn/download', incrementDownload);

// Admin routes
router.post('/', protect, admin, createBook);
router.put('/:isbn', protect, admin, updateBook);
router.delete('/:isbn', protect, admin, deleteBook);

export default router;

