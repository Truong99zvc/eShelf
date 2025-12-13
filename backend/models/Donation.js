import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Allow anonymous donations
    },
    method: {
      type: String,
      enum: ['scratch_card', 'momo', 'atm', 'paypal'],
      required: [true, 'Phương thức thanh toán là bắt buộc'],
    },
    amount: {
      type: Number,
      required: [true, 'Số tiền là bắt buộc'],
      min: [1000, 'Số tiền tối thiểu là 1000 VND'],
    },
    currency: {
      type: String,
      default: 'VND',
    },
    // For scratch card
    scratchCardInfo: {
      cardType: {
        type: String,
        enum: ['viettel', 'vinaphone', 'mobifone', ''],
        default: '',
      },
      serial: {
        type: String,
        default: '',
      },
      code: {
        type: String,
        default: '',
      },
    },
    // Transaction info
    transactionId: {
      type: String,
      default: function () {
        return 'TXN' + Date.now() + Math.random().toString(36).substring(2, 9).toUpperCase();
      },
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    note: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick lookup
donationSchema.index({ transactionId: 1 });
donationSchema.index({ user: 1, createdAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;

