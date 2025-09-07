const express = require('express');
const { ethers } = require('ethers');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/connect-wallet
// @desc    Connect wallet and authenticate user
// @access  Public
router.post('/connect-wallet', async (req, res) => {
  try {
    const { walletAddress, signature, message, studentId, firstName, lastName, email } = req.body;

    // Validate required fields
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and message are required'
      });
    }

    // Verify signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid signature'
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to verify signature'
      });
    }

    // Check if user exists
    let user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });

    if (user) {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Check if this is a new registration with required fields
      if (!studentId || !firstName || !lastName || !email) {
        return res.status(400).json({
          success: false,
          message: 'For new users, student ID, first name, last name, and email are required'
        });
      }

      // Check if student ID or email already exists
      const existingUser = await User.findOne({
        $or: [
          { studentId: studentId },
          { email: email.toLowerCase() }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Student ID or email already registered with another wallet'
        });
      }

      // Create new user
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        studentId,
        firstName,
        lastName,
        email: email.toLowerCase(),
        campusCoinBalance: 100, // Starting bonus
        totalEarned: 100
      });

      await user.save();
    }

    res.json({
      success: true,
      message: user.isNew ? 'User registered successfully' : 'User authenticated successfully',
      user: {
        id: user._id,
        studentId: user.studentId,
        fullName: user.fullName,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        campusCoinBalance: user.campusCoinBalance,
        totalEarned: user.totalEarned,
        totalSpent: user.totalSpent,
        badges: user.badges
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    
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
        email: user.email,
        walletAddress: user.walletAddress,
        department: user.department,
        year: user.year,
        profileImage: user.profileImage,
        role: user.role,
        campusCoinBalance: user.campusCoinBalance,
        totalEarned: user.totalEarned,
        totalSpent: user.totalSpent,
        badges: user.badges,
        isActive: user.isActive,
        joinedAt: user.joinedAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { department, year, profileImage } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (department) user.department = department;
    if (year) user.year = year;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        studentId: user.studentId,
        fullName: user.fullName,
        email: user.email,
        walletAddress: user.walletAddress,
        department: user.department,
        year: user.year,
        profileImage: user.profileImage,
        role: user.role,
        campusCoinBalance: user.campusCoinBalance,
        totalEarned: user.totalEarned,
        totalSpent: user.totalSpent,
        badges: user.badges
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

module.exports = router;