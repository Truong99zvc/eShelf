import Donation from '../models/Donation.js';

// @desc    Create donation
// @route   POST /api/donations
// @access  Public (optionally authenticated)
export const createDonation = async (req, res) => {
  try {
    const { method, amount, scratchCardInfo, note } = req.body;

    if (!method) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn phương thức thanh toán',
      });
    }

    if (!amount || amount < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền tối thiểu là 1.000 VND',
      });
    }

    // For scratch card, validate required fields
    if (method === 'scratch_card') {
      if (
        !scratchCardInfo ||
        !scratchCardInfo.cardType ||
        !scratchCardInfo.serial ||
        !scratchCardInfo.code
      ) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ thông tin thẻ cào',
        });
      }
    }

    const donation = await Donation.create({
      user: req.user ? req.user._id : null,
      method,
      amount,
      scratchCardInfo: method === 'scratch_card' ? scratchCardInfo : undefined,
      note,
      status: method === 'scratch_card' ? 'pending' : 'completed',
    });

    res.status(201).json({
      success: true,
      message: 'Cảm ơn bạn đã ủng hộ! Chúc bạn nhiều sức khỏe và may mắn!',
      data: {
        transactionId: donation.transactionId,
        amount: donation.amount,
        status: donation.status,
        method: donation.method,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's donation history
// @route   GET /api/donations/my-donations
// @access  Private
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user._id })
      .select('transactionId method amount status createdAt')
      .sort({ createdAt: -1 });

    const totalDonated = donations.reduce((sum, d) => {
      return d.status === 'completed' ? sum + d.amount : sum;
    }, 0);

    res.json({
      success: true,
      data: donations,
      totalDonated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check donation status
// @route   GET /api/donations/status/:transactionId
// @access  Public
export const checkDonationStatus = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      transactionId: req.params.transactionId,
    }).select('transactionId method amount status createdAt');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giao dịch',
      });
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== ADMIN ROUTES ==================

// @desc    Get all donations (admin)
// @route   GET /api/donations
// @access  Private/Admin
export const getAllDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.method) {
      query.method = req.query.method;
    }

    const donations = await Donation.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donation.countDocuments(query);

    // Calculate statistics
    const stats = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    // Stats by method
    const statsByMethod = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$method',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: donations,
      stats: stats[0] || { totalAmount: 0, totalCount: 0 },
      statsByMethod,
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

// @desc    Update donation status (admin)
// @route   PUT /api/donations/:id
// @access  Private/Admin
export const updateDonationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giao dịch',
      });
    }

    donation.status = status || donation.status;
    donation.note = note || donation.note;
    await donation.save();

    res.json({
      success: true,
      message: 'Đã cập nhật trạng thái giao dịch',
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};










