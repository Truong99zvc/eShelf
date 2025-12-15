import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from '../../config/db.js';
import config from '../../config/config.js';
import reviewRoutes from '../../routes/reviewRoutes.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.REVIEW_SERVICE_PORT || 5104;

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Review & rating APIs
app.use('/api/reviews', reviewRoutes);

app.get('/api/reviews/health', (req, res) => {
  res.json({
    success: true,
    service: 'review-service',
    message: 'Review service is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[REVIEW-SERVICE] running on port ${PORT}`);
});


