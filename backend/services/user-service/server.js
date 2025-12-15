import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from '../../config/db.js';
import config from '../../config/config.js';
import userRoutes from '../../routes/userRoutes.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 5102;

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// User-related APIs: profile, favorites, bookmarks, reading history
app.use('/api/users', userRoutes);

app.get('/api/users/health', (req, res) => {
  res.json({
    success: true,
    service: 'user-service',
    message: 'User service is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[USER-SERVICE] running on port ${PORT}`);
});


