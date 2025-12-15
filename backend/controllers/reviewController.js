import Review from '../models/Review.js';
import Book from '../models/Book.js';

// @desc    Get reviews for a book
// @route   GET /api/reviews/book/:isbn
// @access  Public
export const getBookReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      bookIsbn: req.params.isbn,
      isActive: true,
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({
      bookIsbn: req.params.isbn,
      isActive: true,
    });

    // Calculate average rating
    const stats = await Review.aggregate([
      { $match: { bookIsbn: req.params.isbn, isActive: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: reviews,
      stats: stats[0] || { avgRating: 0, totalReviews: 0 },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { bookIsbn, rating, comment } = req.body;

    // Check if book exists
    const book = await Book.findOne({ isbn: bookIsbn, isActive: true });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookIsbn,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đánh giá sách này rồi',
      });
    }

    const review = await Review.create({
      bookIsbn,
      user: req.user._id,
      rating: rating || 5,
      comment,
    });

    await review.populate('user', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Đã thêm đánh giá thành công',
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền sửa đánh giá này',
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    await review.populate('user', 'username avatar');

    res.json({
      success: true,
      message: 'Đã cập nhật đánh giá',
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    // Check if user owns the review or is admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa đánh giá này',
      });
    }

    review.isActive = false;
    await review.save();

    res.json({
      success: true,
      message: 'Đã xóa đánh giá',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like/Unlike a review
// @route   POST /api/reviews/:id/like
// @access  Private
export const toggleLikeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá',
      });
    }

    const userIdStr = req.user._id.toString();
    const likeIndex = review.likes.findIndex(
      (id) => id.toString() === userIdStr
    );

    if (likeIndex === -1) {
      review.likes.push(req.user._id);
    } else {
      review.likes.splice(likeIndex, 1);
    }

    await review.save();

    res.json({
      success: true,
      message: likeIndex === -1 ? 'Đã thích' : 'Đã bỏ thích',
      data: { likesCount: review.likes.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    // Get book info for each review
    const bookIsbns = reviews.map((r) => r.bookIsbn);
    const books = await Book.find({
      isbn: { $in: bookIsbns },
    }).select('isbn title author coverUrl');

    const reviewsWithBooks = reviews.map((review) => {
      const book = books.find((b) => b.isbn === review.bookIsbn);
      return {
        ...review.toObject(),
        book: book || { isbn: review.bookIsbn, title: 'Sách không còn tồn tại' },
      };
    });

    res.json({
      success: true,
      data: reviewsWithBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};










