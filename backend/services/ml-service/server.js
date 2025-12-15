import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.ML_SERVICE_PORT || 5201;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// ===== Simple file-based "model registry" to kết nối với mlops/training =====
const MODEL_DIR =
  process.env.ML_MODEL_DIR ||
  path.resolve(process.cwd(), '../../mlops/training/artifacts');
const MODEL_FILE = 'model-metadata.json';

function loadModelMetadata() {
  try {
    const fullPath = path.join(MODEL_DIR, MODEL_FILE);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('[ML-SERVICE] Failed to load model metadata:', err.message);
    return null;
  }
}

let cachedModel = loadModelMetadata();

// Endpoint: xem thông tin model hiện tại
app.get('/api/ml/model', (req, res) => {
  if (!cachedModel) {
    return res.status(404).json({
      success: false,
      message:
        'No ML model metadata found. Hãy chạy script mlops/training/train_recommender.py trước.',
    });
  }

  res.json({
    success: true,
    model: cachedModel,
  });
});

// Endpoint: gợi ý sách cho user
app.get('/api/ml/recommendations', (req, res) => {
  const userId = req.query.userId || 'anonymous';

  // Nếu có model metadata, dùng nó để enrich response (giả lập MLOps)
  const modelInfo = cachedModel || {
    version: '0.0.0',
    algo: 'mock-content-based',
  };

  // TODO: trong bản full, dùng lịch sử đọc từ DB + model thực để sinh gợi ý
  res.json({
    success: true,
    userId,
    strategy: modelInfo.algo,
    modelVersion: modelInfo.version,
    items: [
      {
        isbn: '9780143127741',
        score: 0.95,
      },
      {
        isbn: '9780525559474',
        score: 0.9,
      },
      {
        isbn: '9780062316097',
        score: 0.85,
      },
    ],
  });
});

// Simple health check
app.get('/api/ml/health', (req, res) => {
  res.json({
    success: true,
    service: 'ml-service',
    message: 'ML service is running',
    hasModel: !!cachedModel,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`[ML-SERVICE] running on port ${PORT}`);
});

