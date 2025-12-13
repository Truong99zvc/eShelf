import Book from '../models/Book.js';
import Review from '../models/Review.js';
import Genre from '../models/Genre.js';

// @desc    Get all books with pagination and filtering
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };

    // Search by keyword
    if (req.query.keyword) {
      const keyword = req.query.keyword.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd');
      
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { author: { $regex: keyword, $options: 'i' } },
        { publisher: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by genre
    if (req.query.genre) {
      query.genres = { $in: [req.query.genre] };
    }

    // Filter by genres (multiple)
    if (req.query.genres) {
      const genres = req.query.genres.split(',');
      query.genres = { $in: genres };
    }

    // Filter by year range
    if (req.query.yearFrom || req.query.yearTo) {
      query.year = {};
      if (req.query.yearFrom) {
        query.year.$gte = parseInt(req.query.yearFrom);
      }
      if (req.query.yearTo) {
        query.year.$lte = parseInt(req.query.yearTo);
      }
    }

    // Filter by language
    if (req.query.language) {
      query.language = req.query.language;
    }

    // Sort
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'title':
          sort = { title: 1 };
          break;
        case 'year':
          sort = { year: -1 };
          break;
        case 'popular':
          sort = { viewCount: -1 };
          break;
        case 'downloads':
          sort = { downloadCount: -1 };
          break;
        case 'favorites':
          sort = { favoriteCount: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
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

// @desc    Get single book by ISBN
// @route   GET /api/books/:isbn
// @access  Public
export const getBookByIsbn = async (req, res) => {
  try {
    const book = await Book.findOne({
      isbn: req.params.isbn,
      isActive: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    // Increment view count
    book.viewCount += 1;
    await book.save();

    // Get reviews for this book
    const reviews = await Review.find({
      bookIsbn: req.params.isbn,
      isActive: true,
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        ...book.toObject(),
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get related/suggested books
// @route   GET /api/books/:isbn/related
// @access  Public
export const getRelatedBooks = async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    const limit = parseInt(req.query.limit) || 12;

    // Find books with similar genres
    const relatedBooks = await Book.find({
      isbn: { $ne: req.params.isbn },
      genres: { $in: book.genres },
      isActive: true,
    })
      .limit(limit)
      .select('isbn title author coverUrl genres');

    res.json({
      success: true,
      data: relatedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
export const searchBooks = async (req, res) => {
  try {
    const { q, genre, yearFrom, yearTo, language, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    // Text search
    if (q) {
      const searchText = q.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '');

      query.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { author: { $regex: searchText, $options: 'i' } },
        { publisher: { $regex: searchText, $options: 'i' } },
      ];
    }

    if (genre) {
      const genres = genre.split('+').map(g => decodeURIComponent(g));
      query.genres = { $in: genres };
    }

    if (yearFrom || yearTo) {
      query.year = {};
      if (yearFrom) query.year.$gte = parseInt(yearFrom);
      if (yearTo) query.year.$lte = parseInt(yearTo);
    }

    if (language) {
      query.language = language;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find(query)
      .sort({ viewCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all genres
// @route   GET /api/books/genres
// @access  Public
export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find({ isActive: true })
      .sort({ name: 1 })
      .select('name slug bookCount');

    res.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get books by genre
// @route   GET /api/books/genre/:genreName
// @access  Public
export const getBooksByGenre = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const genreName = decodeURIComponent(req.params.genreName);

    const books = await Book.find({
      genres: { $in: [genreName] },
      isActive: true,
    })
      .sort({ viewCount: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments({
      genres: { $in: [genreName] },
      isActive: true,
    });

    res.json({
      success: true,
      data: books,
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

// @desc    Increment download count
// @route   POST /api/books/:isbn/download
// @access  Public
export const incrementDownload = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { isbn: req.params.isbn },
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    res.json({
      success: true,
      message: 'Đã cập nhật số lượt tải',
      data: { downloadCount: book.downloadCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== ADMIN ROUTES ==================

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    // Update genre counts
    if (book.genres && book.genres.length > 0) {
      await Genre.updateMany(
        { name: { $in: book.genres } },
        { $inc: { bookCount: 1 } }
      );
    }

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:isbn
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { isbn: req.params.isbn },
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a book (soft delete)
// @route   DELETE /api/books/:isbn
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { isbn: req.params.isbn },
      { isActive: false },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa sách thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

