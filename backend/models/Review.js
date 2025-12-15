import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    bookIsbn: {
      type: String,
      required: [true, 'ISBN sách là bắt buộc'],
      ref: 'Book',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Người dùng là bắt buộc'],
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Nội dung bình luận là bắt buộc'],
      maxlength: [1000, 'Bình luận không được vượt quá 1000 ký tự'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review from same user for same book
reviewSchema.index({ bookIsbn: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;










