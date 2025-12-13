import Feedback from '../models/Feedback.js';

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Public (optionally authenticated)
export const createFeedback = async (req, res) => {
  try {
    const { errorType, errorSubType, content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập nội dung phản hồi',
      });
    }

    const feedback = await Feedback.create({
      user: req.user ? req.user._id : null,
      errorType,
      errorSubType,
      content,
    });

    res.status(201).json({
      success: true,
      message: 'Đã gửi phản hồi thành công. Cảm ơn bạn!',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's feedback history
// @route   GET /api/feedback/my-feedback
// @access  Private
export const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== ADMIN ROUTES ==================

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
// @access  Private/Admin
export const getAllFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Filter by status
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.errorType) {
      query.errorType = req.query.errorType;
    }

    const feedback = await Feedback.find(query)
      .populate('user', 'username email')
      .populate('resolvedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments(query);

    // Get counts by status
    const statusCounts = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: feedback,
      statusCounts: statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
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

// @desc    Update feedback status (admin)
// @route   PUT /api/feedback/:id
// @access  Private/Admin
export const updateFeedback = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phản hồi',
      });
    }

    feedback.status = status || feedback.status;
    feedback.adminNote = adminNote || feedback.adminNote;

    if (status === 'resolved') {
      feedback.resolvedBy = req.user._id;
      feedback.resolvedAt = new Date();
    }

    await feedback.save();

    res.json({
      success: true,
      message: 'Đã cập nhật phản hồi',
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete feedback (admin)
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phản hồi',
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa phản hồi',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

