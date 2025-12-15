import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import config from './config/config.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/donations', donationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'eShelf API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to eShelf API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/me': 'Get current user profile (protected)',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password with token',
        'PUT /api/auth/update-password': 'Update password (protected)',
      },
      books: {
        'GET /api/books': 'Get all books with pagination',
        'GET /api/books/search': 'Search books',
        'GET /api/books/genres': 'Get all genres',
        'GET /api/books/genre/:genreName': 'Get books by genre',
        'GET /api/books/:isbn': 'Get book details',
        'GET /api/books/:isbn/related': 'Get related books',
        'POST /api/books/:isbn/download': 'Increment download count',
        'POST /api/books': 'Create book (admin)',
        'PUT /api/books/:isbn': 'Update book (admin)',
        'DELETE /api/books/:isbn': 'Delete book (admin)',
      },
      users: {
        'PUT /api/users/profile': 'Update profile (protected)',
        'GET /api/users/favorites': 'Get favorites (protected)',
        'POST /api/users/favorites/:isbn': 'Add to favorites (protected)',
        'DELETE /api/users/favorites/:isbn': 'Remove from favorites (protected)',
        'GET /api/users/bookmarks': 'Get bookmarks (protected)',
        'POST /api/users/bookmarks/:isbn': 'Add to bookmarks (protected)',
        'DELETE /api/users/bookmarks/:isbn': 'Remove from bookmarks (protected)',
        'GET /api/users/reading-history': 'Get reading history (protected)',
        'POST /api/users/reading-history/:isbn': 'Update reading history (protected)',
      },
      reviews: {
        'GET /api/reviews/book/:isbn': 'Get book reviews',
        'POST /api/reviews': 'Create review (protected)',
        'GET /api/reviews/my-reviews': 'Get my reviews (protected)',
        'PUT /api/reviews/:id': 'Update review (protected)',
        'DELETE /api/reviews/:id': 'Delete review (protected)',
        'POST /api/reviews/:id/like': 'Toggle like review (protected)',
      },
      feedback: {
        'POST /api/feedback': 'Submit feedback',
        'GET /api/feedback/my-feedback': 'Get my feedback (protected)',
        'GET /api/feedback': 'Get all feedback (admin)',
        'PUT /api/feedback/:id': 'Update feedback (admin)',
        'DELETE /api/feedback/:id': 'Delete feedback (admin)',
      },
      donations: {
        'POST /api/donations': 'Create donation',
        'GET /api/donations/status/:transactionId': 'Check donation status',
        'GET /api/donations/my-donations': 'Get my donations (protected)',
        'GET /api/donations': 'Get all donations (admin)',
        'PUT /api/donations/:id': 'Update donation status (admin)',
      },
    },
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// ⚠️ Lưu ý:
// Từ phiên bản microservices, port 5000 được dành cho API Gateway.
// Monolith backend này giữ lại cho mục đích demo/so sánh, mặc định chạy ở port khác.
const PORT = process.env.MONOLITH_PORT || 5001;

app.listen(PORT, () => {
  console.log(
    `
╔═══════════════════════════════════════════════════╗
║                                                   ║
║     📚 eShelf Monolith Backend Server             ║
║                                                   ║
║     Server running in ${config.nodeEnv} mode            ║
║     Port: ${PORT}                                    ║
║     API: http://localhost:${PORT}/api                  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
`
  );
});

export default app;










