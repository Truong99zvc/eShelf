import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from '../../config/db.js';
import config from '../../config/config.js';
import feedbackRoutes from '../../routes/feedbackRoutes.js';
import donationRoutes from '../../routes/donationRoutes.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.ENGAGEMENT_SERVICE_PORT || 5105;

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Feedback & donation APIs
app.use('/api/feedback', feedbackRoutes);
app.use('/api/donations', donationRoutes);

app.get('/api/engagement/health', (req, res) => {
  res.json({
    success: true,
    service: 'engagement-service',
    message: 'Engagement service is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[ENGAGEMENT-SERVICE] running on port ${PORT}`);
});


