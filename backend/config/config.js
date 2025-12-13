// Environment Configuration
// Copy this to .env file and update values for production

const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB Configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/eshelf',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'eshelf_super_secret_jwt_key_2024',
  jwtExpire: process.env.JWT_EXPIRE || '30d',

  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export default config;

