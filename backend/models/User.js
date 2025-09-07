const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Information
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Blockchain Information
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Profile Information
  department: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    min: 1,
    max: 5
  },
  profileImage: {
    type: String, // IPFS hash or URL
    default: null
  },
  
  // Token Information
  campusCoinBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // NFT Badges
  badges: [{
    tokenId: String,
    name: String,
    description: String,
    imageUrl: String,
    metadata: Object,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // User Status
  role: {
    type: String,
    enum: ['student', 'admin', 'vendor'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Activity Tracking
  lastLogin: {
    type: Date,
    default: Date.now
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for net balance
userSchema.virtual('netBalance').get(function() {
  return this.totalEarned - this.totalSpent;
});

// Index for efficient queries
userSchema.index({ walletAddress: 1 });
userSchema.index({ studentId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Ensure wallet address is lowercase
  if (this.walletAddress) {
    this.walletAddress = this.walletAddress.toLowerCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);