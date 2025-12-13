import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Không tìm thấy người dùng',
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Tài khoản đã bị khóa',
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập để truy cập',
    });
  }
};

// Optional authentication - doesn't require login but attaches user if logged in
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token invalid, continue without user
      req.user = null;
    }
  }

  next();
};

// Admin only middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập',
    });
  }
};

// Generate JWT Token
export const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

