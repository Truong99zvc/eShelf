import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from '../../config/db.js';
import config from '../../config/config.js';
import authRoutes from '../../routes/authRoutes.js';

dotenv.config();

// Kết nối MongoDB dùng lại module hiện có
connectDB();

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 5101;

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Chỉ mount các route auth
app.use('/api/auth', authRoutes);

app.get('/api/auth/health', (req, res) => {
  res.json({
    success: true,
    service: 'auth-service',
    message: 'Auth service is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[AUTH-SERVICE] running on port ${PORT}`);
});


