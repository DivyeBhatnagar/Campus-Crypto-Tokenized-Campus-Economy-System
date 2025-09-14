const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tokens/balance
// @desc    Get user's token balance
// @access  Private
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      balance: {
        campusCoin: user.campusCoinBalance,
        totalEarned: user.totalEarned,
        totalSpent: user.totalSpent,
        netBalance: user.netBalance
      }
    });

  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching balance'
    });
  }
});

// @route   POST /api/tokens/transfer
// @desc    Transfer tokens between users
// @access  Private
router.post('/transfer', auth, async (req, res) => {
  try {
    const { toAddress, amount, description } = req.body;

    if (!toAddress || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid recipient address and amount are required'
      });
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Transfer description is required'
      });
    }

    // Get sender and recipient
    const sender = await User.findById(req.user.id);
    const recipient = await User.findOne({ 
      walletAddress: toAddress.toLowerCase() 
    });

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: 'Sender not found'
      });
    }

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    if (sender.walletAddress === recipient.walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer to yourself'
      });
    }

    // Check sender balance
    if (sender.campusCoinBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      transactionHash: `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blockNumber: 0,
      type: 'transfer',
      category: 'peer_transfer',
      amount,
      fromAddress: sender.walletAddress,
      toAddress: recipient.walletAddress,
      fromUser: sender._id,
      toUser: recipient._id,
      description: description,
      status: 'confirmed',
      blockTimestamp: new Date(),
      metadata: {
        transferType: 'peer_to_peer'
      }
    });

    await transaction.save();

    // Update balances
    sender.campusCoinBalance -= amount;
    sender.totalSpent += amount;
    
    recipient.campusCoinBalance += amount;
    recipient.totalEarned += amount;

    await sender.save();
    await recipient.save();

    res.json({
      success: true,
      message: 'Transfer completed successfully',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        description: transaction.description,
        recipient: {
          fullName: recipient.fullName,
          studentId: recipient.studentId
        }
      },
      newBalance: sender.campusCoinBalance
    });

  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing transfer'
    });
  }
});

// @route   GET /api/tokens/transactions
// @desc    Get user's transaction history
// @access  Private
router.get('/transactions', auth, async (req, res) => {
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
      .populate('fromUser', 'fullName studentId walletAddress')
      .populate('toUser', 'fullName studentId walletAddress')
      .populate('rewardRuleId', 'name code')
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
        blockTimestamp: tx.blockTimestamp,
        metadata: tx.metadata
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching transactions'
    });
  }
});

module.exports = router;