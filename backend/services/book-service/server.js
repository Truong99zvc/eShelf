import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from '../../config/db.js';
import config from '../../config/config.js';
import bookRoutes from '../../routes/bookRoutes.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.BOOK_SERVICE_PORT || 5103;

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Book catalog & search APIs
app.use('/api/books', bookRoutes);

app.get('/api/books/health', (req, res) => {
  res.json({
    success: true,
    service: 'book-service',
    message: 'Book service is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[BOOK-SERVICE] running on port ${PORT}`);
});


