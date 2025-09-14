const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction Identification
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  blockNumber: {
    type: Number,
    required: true
  },
  
  // Transaction Details
  type: {
    type: String,
    enum: ['earn', 'spend', 'transfer', 'reward', 'penalty'],
    required: true
  },
  category: {
    type: String,
    enum: [
      'attendance', 'hackathon', 'volunteering', 'sports', 'project',
      'canteen', 'library', 'events', 'merchandise', 'scholarship',
      'peer_transfer', 'admin_reward', 'penalty'
    ],
    required: true
  },
  
  // Amount and Participants
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  fromAddress: {
    type: String,
    required: true,
    trim: true
  },
  toAddress: {
    type: String,
    required: true,
    trim: true
  },
  
  // User References
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Transaction Context
  description: {
    type: String,
    required: true,
    trim: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  rewardRuleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RewardRule'
  },
  
  // Status and Verification
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  gasUsed: {
    type: Number
  },
  gasFee: {
    type: String // in wei
  },
  
  // Metadata
  metadata: {
    type: Object,
    default: {}
  },
  
  // Timestamps
  blockTimestamp: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
transactionSchema.index({ transactionHash: 1 });
transactionSchema.index({ fromAddress: 1 });
transactionSchema.index({ toAddress: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ blockTimestamp: -1 });
transactionSchema.index({ fromUser: 1, createdAt: -1 });
transactionSchema.index({ toUser: 1, createdAt: -1 });

// Pre-save middleware
transactionSchema.pre('save', function(next) {
  // Ensure addresses are lowercase
  if (this.fromAddress) {
    this.fromAddress = this.fromAddress.toLowerCase();
  }
  if (this.toAddress) {
    this.toAddress = this.toAddress.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);