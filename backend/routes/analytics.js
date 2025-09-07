const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const RewardRule = require('../models/RewardRule');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (timeframe) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // User's statistics
    const user = await User.findById(userId);
    
    // Transaction statistics
    const [earnedTransactions, spentTransactions] = await Promise.all([
      Transaction.find({
        toUser: userId,
        type: { $in: ['earn', 'reward'] },
        createdAt: { $gte: startDate }
      }).sort({ createdAt: 1 }),
      
      Transaction.find({
        fromUser: userId,
        type: { $in: ['spend', 'transfer'] },
        createdAt: { $gte: startDate }
      }).sort({ createdAt: 1 })
    ]);

    // Category breakdown
    const categoryEarned = await Transaction.aggregate([
      {
        $match: {
          toUser: user._id,
          type: { $in: ['earn', 'reward'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const categorySpent = await Transaction.aggregate([
      {
        $match: {
          fromUser: user._id,
          type: { $in: ['spend', 'transfer'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activity
    const recentActivity = await Transaction.find({
      $or: [{ fromUser: userId }, { toUser: userId }]
    })
      .populate('fromUser', 'fullName studentId')
      .populate('toUser', 'fullName studentId')
      .populate('rewardRuleId', 'name code')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      analytics: {
        summary: {
          currentBalance: user.campusCoinBalance,
          totalEarned: user.totalEarned,
          totalSpent: user.totalSpent,
          badgeCount: user.badges.length,
          netBalance: user.netBalance
        },
        timeframe: {
          period: timeframe,
          startDate,
          endDate: new Date()
        },
        earned: {
          total: earnedTransactions.reduce((sum, tx) => sum + tx.amount, 0),
          transactions: earnedTransactions.length,
          byCategory: categoryEarned
        },
        spent: {
          total: spentTransactions.reduce((sum, tx) => sum + tx.amount, 0),
          transactions: spentTransactions.length,
          byCategory: categorySpent
        },
        recentActivity: recentActivity.map(tx => ({
          id: tx._id,
          type: tx.type,
          category: tx.category,
          amount: tx.amount,
          description: tx.description,
          fromUser: tx.fromUser,
          toUser: tx.toUser,
          rewardRule: tx.rewardRuleId,
          createdAt: tx.createdAt
        }))
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
});

// @route   GET /api/analytics/admin
// @desc    Get admin analytics (platform-wide)
// @access  Admin
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    let startDate = new Date();
    switch (timeframe) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Platform statistics
    const [
      totalUsers,
      activeUsers,
      totalTransactions,
      totalTokensInCirculation,
      rewardRulesCount
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ 
        role: 'student', 
        lastLogin: { $gte: startDate } 
      }),
      Transaction.countDocuments({ createdAt: { $gte: startDate } }),
      User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: null, total: { $sum: '$campusCoinBalance' } } }
      ]),
      RewardRule.countDocuments({ isActive: true })
    ]);

    // Transaction volume over time
    const transactionVolume = await Transaction.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          volume: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top earning categories
    const topCategories = await Transaction.aggregate([
      {
        $match: {
          type: { $in: ['earn', 'reward'] },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    // Top spending categories
    const topSpendingCategories = await Transaction.aggregate([
      {
        $match: {
          type: 'spend',
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    // Most active users
    const mostActiveUsers = await Transaction.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { 
            $cond: [
              { $eq: ['$type', 'earn'] },
              '$toUser',
              '$fromUser'
            ]
          },
          transactionCount: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { transactionCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          activeUsers,
          totalTransactions,
          totalTokensInCirculation: totalTokensInCirculation[0]?.total || 0,
          activeRewardRules: rewardRulesCount
        },
        timeframe: {
          period: timeframe,
          startDate,
          endDate: new Date()
        },
        transactionVolume,
        categories: {
          topEarning: topCategories,
          topSpending: topSpendingCategories
        },
        mostActiveUsers: mostActiveUsers.map(item => ({
          user: {
            id: item.user._id,
            fullName: item.user.fullName,
            studentId: item.user.studentId
          },
          transactionCount: item.transactionCount,
          totalAmount: item.totalAmount
        }))
      }
    });

  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin analytics'
    });
  }
});

module.exports = router;