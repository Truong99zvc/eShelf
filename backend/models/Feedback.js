import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Allow anonymous feedback
    },
    errorType: {
      type: String,
      enum: ['book', 'account', 'donate', 'other'],
      required: [true, 'Loại lỗi là bắt buộc'],
    },
    errorSubType: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Nội dung phản hồi là bắt buộc'],
      maxlength: [2000, 'Nội dung không được vượt quá 2000 ký tự'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'resolved', 'rejected'],
      default: 'pending',
    },
    adminNote: {
      type: String,
      default: '',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;

