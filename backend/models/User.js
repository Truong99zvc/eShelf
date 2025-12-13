import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Vui lòng nhập tên tài khoản'],
      unique: true,
      trim: true,
      minlength: [3, 'Tên tài khoản phải có ít nhất 3 ký tự'],
      maxlength: [15, 'Tên tài khoản không được vượt quá 15 ký tự'],
      match: [/^[a-zA-Z0-9_]+$/, 'Tên tài khoản chỉ chứa chữ cái, số và dấu gạch dưới'],
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email không hợp lệ',
      ],
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
      select: false,
    },
    avatar: {
      type: String,
      default: '/images/default-avatar.png',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    favorites: [
      {
        type: String, // ISBN of book
        ref: 'Book',
      },
    ],
    bookmarks: [
      {
        type: String, // ISBN of book
        ref: 'Book',
      },
    ],
    readingHistory: [
      {
        book: {
          type: String, // ISBN of book
          ref: 'Book',
        },
        lastRead: {
          type: Date,
          default: Date.now,
        },
        progress: {
          type: Number, // page number or percentage
          default: 0,
        },
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.generateResetToken = function () {
  const resetToken = Math.random().toString(36).substring(2, 15);
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;

