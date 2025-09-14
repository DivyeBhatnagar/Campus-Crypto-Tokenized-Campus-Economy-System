const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-__v')
      .populate('badges');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        studentId: user.studentId,
        fullName: user.fullName,
        department: user.department,
        year: user.year,
        profileImage: user.profileImage,
        totalEarned: user.totalEarned,
        badges: user.badges,
        joinedAt: user.joinedAt
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get user leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { limit = 50, type = 'totalEarned' } = req.query;
    
    const sortField = type === 'balance' ? 'campusCoinBalance' : 'totalEarned';
    
    const users = await User.find({ 
      isActive: true,
      role: 'student'
    })
      .select('studentId firstName lastName department year totalEarned campusCoinBalance badges')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaderboard: users.map((user, index) => ({
        rank: index + 1,
        id: user._id,
        studentId: user.studentId,
        fullName: user.fullName,
        department: user.department,
        year: user.year,
        totalEarned: user.totalEarned,
        currentBalance: user.campusCoinBalance,
        badgeCount: user.badges.length
      }))
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching leaderboard'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    
    const users = await User.find({
      isActive: true,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { studentId: searchRegex },
        { email: searchRegex }
      ]
    })
      .select('studentId firstName lastName department year profileImage')
      .limit(parseInt(limit));

    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        studentId: user.studentId,
        fullName: user.fullName,
        department: user.department,
        year: user.year,
        profileImage: user.profileImage
      }))
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching users'
    });
  }
});

module.exports = router;