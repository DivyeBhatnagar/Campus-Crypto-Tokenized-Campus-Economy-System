const express = require('express');
const RewardRule = require('../models/RewardRule');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rewards/rules
// @desc    Get all active reward rules
// @access  Private
router.get('/rules', auth, async (req, res) => {
  try {
    const rules = await RewardRule.find({ 
      isActive: true,
      $or: [
        { startDate: { $lte: new Date() } },
        { startDate: null }
      ],
      $or: [
        { endDate: { $gte: new Date() } },
        { endDate: null }
      ]
    }).populate('createdBy', 'fullName email');

    res.json({
      success: true,
      rules: rules.map(rule => ({
        id: rule._id,
        name: rule.name,
        code: rule.code,
        category: rule.category,
        tokenReward: rule.tokenReward,
        description: rule.description,
        requirements: rule.requirements,
        nftBadge: rule.nftBadge,
        maxClaimsPerUser: rule.maxClaimsPerUser,
        cooldownPeriod: rule.cooldownPeriod,
        totalClaims: rule.totalClaims,
        isValid: rule.isValid,
        tags: rule.tags
      }))
    });

  } catch (error) {
    console.error('Get reward rules error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reward rules'
    });
  }
});

// @route   POST /api/rewards/claim
// @desc    Claim reward tokens
// @access  Private
router.post('/claim', auth, async (req, res) => {
  try {
    const { ruleCode, evidence, metadata } = req.body;

    if (!ruleCode) {
      return res.status(400).json({
        success: false,
        message: 'Reward rule code is required'
      });
    }

    // Find the reward rule
    const rule = await RewardRule.findOne({ 
      code: ruleCode.toUpperCase(),
      isActive: true 
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: 'Reward rule not found or inactive'
      });
    }

    // Check if rule is valid (time-based constraints)
    if (!rule.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Reward rule is no longer valid'
      });
    }

    // Get current user
    const user = await User.findById(req.user.id);

    // Check user-specific claim limits
    if (rule.maxClaimsPerUser > 0) {
      const userClaims = await Transaction.countDocuments({
        toUser: user._id,
        rewardRuleId: rule._id,
        status: 'confirmed'
      });

      if (userClaims >= rule.maxClaimsPerUser) {
        return res.status(400).json({
          success: false,
          message: `You have already claimed this reward ${rule.maxClaimsPerUser} times`
        });
      }
    }

    // Check cooldown period
    if (rule.cooldownPeriod > 0) {
      const lastClaim = await Transaction.findOne({
        toUser: user._id,
        rewardRuleId: rule._id,
        status: 'confirmed'
      }).sort({ createdAt: -1 });

      if (lastClaim) {
        const cooldownEnd = new Date(lastClaim.createdAt.getTime() + (rule.cooldownPeriod * 60 * 60 * 1000));
        if (new Date() < cooldownEnd) {
          return res.status(400).json({
            success: false,
            message: `Cooldown period active. Next claim available at ${cooldownEnd.toLocaleString()}`
          });
        }
      }
    }

    // Create pending transaction record
    const transaction = new Transaction({
      transactionHash: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blockNumber: 0, // Will be updated when blockchain transaction confirms
      type: 'earn',
      category: rule.category,
      amount: rule.tokenReward,
      fromAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
      toAddress: user.walletAddress,
      toUser: user._id,
      description: `Reward claimed: ${rule.name}`,
      rewardRuleId: rule._id,
      status: 'pending',
      blockTimestamp: new Date(),
      metadata: {
        evidence,
        customMetadata: metadata,
        ruleCode: rule.code
      }
    });

    await transaction.save();

    // Update user balance (optimistic update)
    user.campusCoinBalance += rule.tokenReward;
    user.totalEarned += rule.tokenReward;
    await user.save();

    // Update rule statistics
    rule.totalClaims += 1;
    rule.totalTokensDistributed += rule.tokenReward;
    await rule.save();

    // If NFT badge is enabled, add it to user
    if (rule.nftBadge.enabled) {
      user.badges.push({
        tokenId: `badge_${rule.code}_${Date.now()}`,
        name: rule.nftBadge.name,
        description: rule.nftBadge.description,
        imageUrl: rule.nftBadge.imageUrl,
        metadata: {
          ruleCode: rule.code,
          earnedFor: rule.name,
          attributes: rule.nftBadge.attributes
        }
      });
      await user.save();
    }

    res.json({
      success: true,
      message: 'Reward claimed successfully',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        status: transaction.status
      },
      newBalance: user.campusCoinBalance,
      nftBadgeAwarded: rule.nftBadge.enabled
    });

  } catch (error) {
    console.error('Claim reward error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error claiming reward'
    });
  }
});

// @route   GET /api/rewards/history
// @desc    Get user's reward history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category } = req.query;
    
    const query = {
      $or: [
        { fromUser: req.user.id },
        { toUser: req.user.id }
      ]
    };

    if (type) query.type = type;
    if (category) query.category = category;

    const transactions = await Transaction.find(query)
      .populate('rewardRuleId', 'name code description')
      .populate('fromUser', 'fullName studentId')
      .populate('toUser', 'fullName studentId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      transactions: transactions.map(tx => ({
        id: tx._id,
        hash: tx.transactionHash,
        type: tx.type,
        category: tx.category,
        amount: tx.amount,
        description: tx.description,
        status: tx.status,
        fromUser: tx.fromUser,
        toUser: tx.toUser,
        rewardRule: tx.rewardRuleId,
        createdAt: tx.createdAt,
        blockTimestamp: tx.blockTimestamp
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get reward history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reward history'
    });
  }
});

// Admin Routes

// @route   POST /api/rewards/rules
// @desc    Create new reward rule
// @access  Admin
router.post('/rules', adminAuth, async (req, res) => {
  try {
    const {
      name, code, category, tokenReward, description, requirements,
      nftBadge, maxClaimsPerUser, maxClaimsTotal, cooldownPeriod,
      startDate, endDate, tags
    } = req.body;

    // Check if rule code already exists
    const existingRule = await RewardRule.findOne({ 
      code: code.toUpperCase() 
    });

    if (existingRule) {
      return res.status(400).json({
        success: false,
        message: 'Reward rule with this code already exists'
      });
    }

    const rule = new RewardRule({
      name,
      code: code.toUpperCase(),
      category,
      tokenReward,
      description,
      requirements: requirements || [],
      nftBadge: nftBadge || { enabled: false },
      maxClaimsPerUser: maxClaimsPerUser || -1,
      maxClaimsTotal: maxClaimsTotal || -1,
      cooldownPeriod: cooldownPeriod || 0,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      createdBy: req.user.id,
      tags: tags || []
    });

    await rule.save();

    res.status(201).json({
      success: true,
      message: 'Reward rule created successfully',
      rule: {
        id: rule._id,
        name: rule.name,
        code: rule.code,
        category: rule.category,
        tokenReward: rule.tokenReward,
        description: rule.description,
        isActive: rule.isActive
      }
    });

  } catch (error) {
    console.error('Create reward rule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating reward rule'
    });
  }
});

module.exports = router;