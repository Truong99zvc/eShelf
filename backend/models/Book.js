import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: [true, 'ISBN là bắt buộc'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Tiêu đề sách là bắt buộc'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    author: {
      type: [String],
      required: [true, 'Tác giả là bắt buộc'],
    },
    translator: {
      type: [String],
      default: [],
    },
    publisher: {
      type: String,
      default: null,
    },
    genres: {
      type: [String],
      default: [],
    },
    year: {
      type: Number,
      default: null,
    },
    bookLanguage: {
      type: String,
      default: 'Tiếng Việt',
    },
    pages: {
      type: Number,
      default: 0,
    },
    extension: {
      type: String,
      default: 'PDF',
    },
    size: {
      type: String,
      default: '',
    },
    coverUrl: {
      type: String,
      default: '/images/default-book-cover.jpg',
    },
    pdfUrl: {
      type: String,
      required: [true, 'URL file sách là bắt buộc'],
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: 'isbn',
  foreignField: 'bookIsbn',
});

// Index for search - use 'none' as default language to support Vietnamese
bookSchema.index(
  { title: 'text', author: 'text', publisher: 'text', description: 'text' },
  { default_language: 'none' }
);
bookSchema.index({ genres: 1 });
bookSchema.index({ year: 1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;
