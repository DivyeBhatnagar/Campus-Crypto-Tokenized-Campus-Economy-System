const User = require('../models/User');

// Simple auth middleware for wallet-based authentication
const auth = async (req, res, next) => {
  try {
    // Get wallet address from headers
    const walletAddress = req.header('X-Wallet-Address');
    
    if (!walletAddress) {
      return res.status(401).json({
        success: false,
        message: 'No wallet address provided'
      });
    }

    // Find user by wallet address
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Add user info to request
    req.user = {
      id: user._id,
      walletAddress: user.walletAddress,
      role: user.role,
      studentId: user.studentId
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Admin auth middleware
const adminAuth = async (req, res, next) => {
  try {
    // First run regular auth
    await auth(req, res, async () => {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }
      next();
    });
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in admin authentication'
    });
  }
};

module.exports = { auth, adminAuth };