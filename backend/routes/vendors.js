const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vendors/products
// @desc    Get available products/services for redemption
// @access  Private
router.get('/products', auth, async (req, res) => {
  try {
    // Mock data for now - in a real app, you'd have a Products model
    const products = [
      {
        id: 'canteen_meal_1',
        name: 'Regular Meal',
        description: 'Standard meal combo with rice, curry, and sides',
        category: 'canteen',
        price: 50,
        vendor: 'Campus Canteen',
        image: '/images/products/meal1.jpg',
        availability: true
      },
      {
        id: 'canteen_meal_2',
        name: 'Premium Meal',
        description: 'Premium meal with special dishes and dessert',
        category: 'canteen',
        price: 75,
        vendor: 'Campus Canteen',
        image: '/images/products/meal2.jpg',
        availability: true
      },
      {
        id: 'library_extend',
        name: 'Book Extension (7 days)',
        description: 'Extend your book borrowing period by 7 days',
        category: 'library',
        price: 20,
        vendor: 'Central Library',
        image: '/images/products/library.jpg',
        availability: true
      },
      {
        id: 'event_pass_1',
        name: 'Cultural Event Pass',
        description: 'Access to premium cultural events and shows',
        category: 'events',
        price: 100,
        vendor: 'Student Activities',
        image: '/images/products/event.jpg',
        availability: true
      },
      {
        id: 'merch_tshirt',
        name: 'Campus T-Shirt',
        description: 'Official campus merchandise t-shirt',
        category: 'merchandise',
        price: 150,
        vendor: 'Campus Store',
        image: '/images/products/tshirt.jpg',
        availability: true
      },
      {
        id: 'parking_day',
        name: 'Day Parking Pass',
        description: 'One day parking access in premium lots',
        category: 'services',
        price: 30,
        vendor: 'Campus Security',
        image: '/images/products/parking.jpg',
        availability: true
      }
    ];

    res.json({
      success: true,
      products: products.filter(p => p.availability)
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
});

// @route   POST /api/vendors/redeem
// @desc    Redeem tokens for products/services
// @access  Private
router.post('/redeem', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, notes } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Mock product data - in a real app, you'd fetch from Products model
    const products = {
      'canteen_meal_1': { name: 'Regular Meal', price: 50, vendor: 'Campus Canteen', category: 'canteen' },
      'canteen_meal_2': { name: 'Premium Meal', price: 75, vendor: 'Campus Canteen', category: 'canteen' },
      'library_extend': { name: 'Book Extension (7 days)', price: 20, vendor: 'Central Library', category: 'library' },
      'event_pass_1': { name: 'Cultural Event Pass', price: 100, vendor: 'Student Activities', category: 'events' },
      'merch_tshirt': { name: 'Campus T-Shirt', price: 150, vendor: 'Campus Store', category: 'merchandise' },
      'parking_day': { name: 'Day Parking Pass', price: 30, vendor: 'Campus Security', category: 'services' }
    };

    const product = products[productId];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const totalCost = product.price * quantity;

    // Get user and check balance
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.campusCoinBalance < totalCost) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance',
        required: totalCost,
        available: user.campusCoinBalance
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      transactionHash: `redeem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blockNumber: 0,
      type: 'spend',
      category: product.category,
      amount: totalCost,
      fromAddress: user.walletAddress,
      toAddress: '0x0000000000000000000000000000000000000000', // Vendor contract address
      fromUser: user._id,
      description: `Redeemed: ${quantity}x ${product.name}`,
      status: 'confirmed',
      blockTimestamp: new Date(),
      metadata: {
        productId,
        productName: product.name,
        vendor: product.vendor,
        quantity,
        unitPrice: product.price,
        notes: notes || '',
        redemptionCode: `RDM${Date.now().toString(36).toUpperCase()}`
      }
    });

    await transaction.save();

    // Update user balance
    user.campusCoinBalance -= totalCost;
    user.totalSpent += totalCost;
    await user.save();

    res.json({
      success: true,
      message: 'Redemption successful',
      redemption: {
        id: transaction._id,
        product: product.name,
        vendor: product.vendor,
        quantity,
        totalCost,
        redemptionCode: transaction.metadata.redemptionCode,
        timestamp: transaction.createdAt
      },
      newBalance: user.campusCoinBalance
    });

  } catch (error) {
    console.error('Redemption error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing redemption'
    });
  }
});

// @route   GET /api/vendors/redemptions
// @desc    Get user's redemption history
// @access  Private
router.get('/redemptions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    
    const query = {
      fromUser: req.user.id,
      type: 'spend'
    };

    if (category) query.category = category;

    const redemptions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      redemptions: redemptions.map(tx => ({
        id: tx._id,
        productName: tx.metadata.productName,
        vendor: tx.metadata.vendor,
        quantity: tx.metadata.quantity,
        amount: tx.amount,
        redemptionCode: tx.metadata.redemptionCode,
        category: tx.category,
        status: tx.status,
        notes: tx.metadata.notes,
        redeemedAt: tx.createdAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get redemptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching redemptions'
    });
  }
});

module.exports = router;