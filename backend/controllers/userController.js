import User from '../models/User.js';
import Book from '../models/Book.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { username, email, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    // Check if username is taken by another user
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'Tên tài khoản đã tồn tại',
        });
      }
    }

    // Check if email is taken by another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được sử dụng',
        });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add book to favorites
// @route   POST /api/users/favorites/:isbn
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { isbn } = req.params;

    // Check if book exists
    const book = await Book.findOne({ isbn, isActive: true });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already in favorites
    if (user.favorites.includes(isbn)) {
      return res.status(400).json({
        success: false,
        message: 'Sách đã có trong danh sách yêu thích',
      });
    }

    user.favorites.push(isbn);
    await user.save();

    // Increment book's favorite count
    await Book.findOneAndUpdate(
      { isbn },
      { $inc: { favoriteCount: 1 } }
    );

    res.json({
      success: true,
      message: 'Đã thêm vào danh sách yêu thích',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove book from favorites
// @route   DELETE /api/users/favorites/:isbn
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const { isbn } = req.params;

    const user = await User.findById(req.user._id);

    const index = user.favorites.indexOf(isbn);
    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: 'Sách không có trong danh sách yêu thích',
      });
    }

    user.favorites.splice(index, 1);
    await user.save();

    // Decrement book's favorite count
    await Book.findOneAndUpdate(
      { isbn },
      { $inc: { favoriteCount: -1 } }
    );

    res.json({
      success: true,
      message: 'Đã xóa khỏi danh sách yêu thích',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's favorite books
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const books = await Book.find({
      isbn: { $in: user.favorites },
      isActive: true,
    }).select('isbn title author coverUrl genres');

    res.json({
      success: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add book to bookmarks
// @route   POST /api/users/bookmarks/:isbn
// @access  Private
export const addBookmark = async (req, res) => {
  try {
    const { isbn } = req.params;

    // Check if book exists
    const book = await Book.findOne({ isbn, isActive: true });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách',
      });
    }

    const user = await User.findById(req.user._id);

    if (user.bookmarks.includes(isbn)) {
      return res.status(400).json({
        success: false,
        message: 'Sách đã có trong danh sách đánh dấu',
      });
    }

    user.bookmarks.push(isbn);
    await user.save();

    res.json({
      success: true,
      message: 'Đã thêm vào danh sách đánh dấu',
      data: { bookmarks: user.bookmarks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove book from bookmarks
// @route   DELETE /api/users/bookmarks/:isbn
// @access  Private
export const removeBookmark = async (req, res) => {
  try {
    const { isbn } = req.params;

    const user = await User.findById(req.user._id);

    const index = user.bookmarks.indexOf(isbn);
    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: 'Sách không có trong danh sách đánh dấu',
      });
    }

    user.bookmarks.splice(index, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Đã xóa khỏi danh sách đánh dấu',
      data: { bookmarks: user.bookmarks },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's bookmarked books
// @route   GET /api/users/bookmarks
// @access  Private
export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const books = await Book.find({
      isbn: { $in: user.bookmarks },
      isActive: true,
    }).select('isbn title author coverUrl genres');

    res.json({
      success: true,
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update reading progress
// @route   POST /api/users/reading-history/:isbn
// @access  Private
export const updateReadingHistory = async (req, res) => {
  try {
    const { isbn } = req.params;
    const { progress } = req.body;

    const user = await User.findById(req.user._id);

    const existingIndex = user.readingHistory.findIndex(
      (item) => item.book === isbn
    );

    if (existingIndex !== -1) {
      user.readingHistory[existingIndex].lastRead = new Date();
      user.readingHistory[existingIndex].progress = progress || 0;
    } else {
      user.readingHistory.push({
        book: isbn,
        lastRead: new Date(),
        progress: progress || 0,
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Đã cập nhật lịch sử đọc',
      data: { readingHistory: user.readingHistory },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get reading history
// @route   GET /api/users/reading-history
// @access  Private
export const getReadingHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const bookIsbns = user.readingHistory.map((item) => item.book);
    const books = await Book.find({
      isbn: { $in: bookIsbns },
      isActive: true,
    }).select('isbn title author coverUrl');

    const history = user.readingHistory.map((item) => {
      const book = books.find((b) => b.isbn === item.book);
      return {
        book: book || { isbn: item.book, title: 'Sách không còn tồn tại' },
        lastRead: item.lastRead,
        progress: item.progress,
      };
    });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== ADMIN ROUTES ==================

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
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

// @desc    Toggle user active status (admin)
// @route   PUT /api/users/:id/toggle-active
// @access  Private/Admin
export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản',
      data: { isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};










