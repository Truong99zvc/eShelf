import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();

const PORT = process.env.GATEWAY_PORT || 5000;

// Basic CORS config – allow frontend and local tools
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// Base URLs for internal services (can be moved to .env)
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:5101',
  users: process.env.USER_SERVICE_URL || 'http://localhost:5102',
  books: process.env.BOOK_SERVICE_URL || 'http://localhost:5103',
  reviews: process.env.REVIEW_SERVICE_URL || 'http://localhost:5104',
  engagement: process.env.ENGAGEMENT_SERVICE_URL || 'http://localhost:5105',
  donations: process.env.DONATION_SERVICE_URL || 'http://localhost:5106',
  ml: process.env.ML_SERVICE_URL || 'http://localhost:5201',
};

// Helper to build proxy with common options
const makeProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: 'warn',
    pathRewrite: {
      '^/api/auth': '/api/auth',
      '^/api/users': '/api/users',
      '^/api/books': '/api/books',
      '^/api/reviews': '/api/reviews',
      '^/api/feedback': '/api/feedback',
      '^/api/donations': '/api/donations',
      '^/api/ml': '/api/ml',
    },
  });

// Health check for gateway
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'api-gateway',
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
  });
});

// Route -> service mapping
app.use('/api/auth', makeProxy(SERVICES.auth));
app.use('/api/users', makeProxy(SERVICES.users));
app.use('/api/books', makeProxy(SERVICES.books));
app.use('/api/reviews', makeProxy(SERVICES.reviews));
app.use('/api/feedback', makeProxy(SERVICES.engagement));
app.use('/api/donations', makeProxy(SERVICES.donations));
app.use('/api/ml', makeProxy(SERVICES.ml));

app.listen(PORT, () => {
  console.log(
    `[API-GATEWAY] Listening on port ${PORT} → forwarding to services:`,
    SERVICES
  );
});


