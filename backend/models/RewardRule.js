const mongoose = require('mongoose');

const rewardRuleSchema = new mongoose.Schema({
  // Rule Identification
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  
  // Rule Configuration
  category: {
    type: String,
    enum: [
      'attendance', 'hackathon', 'volunteering', 'sports', 'project',
      'academic', 'leadership', 'community', 'special'
    ],
    required: true
  },
  tokenReward: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Rule Conditions
  description: {
    type: String,
    required: true,
    trim: true
  },
  requirements: [{
    condition: String,
    value: mongoose.Schema.Types.Mixed,
    operator: {
      type: String,
      enum: ['equals', 'greater_than', 'less_than', 'contains', 'exists']
    }
  }],
  
  // NFT Badge Configuration (if applicable)
  nftBadge: {
    enabled: {
      type: Boolean,
      default: false
    },
    name: String,
    description: String,
    imageUrl: String, // IPFS hash or URL
    attributes: [{
      trait_type: String,
      value: String
    }]
  },
  
  // Rule Limits
  maxClaimsPerUser: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  maxClaimsTotal: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  cooldownPeriod: {
    type: Number, // in hours
    default: 0
  },
  
  // Rule Status
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  
  // Usage Statistics
  totalClaims: {
    type: Number,
    default: 0
  },
  totalTokensDistributed: {
    type: Number,
    default: 0
  },
  
  // Administrative
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Metadata
  tags: [String],
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
rewardRuleSchema.index({ code: 1 });
rewardRuleSchema.index({ category: 1 });
rewardRuleSchema.index({ isActive: 1 });
rewardRuleSchema.index({ startDate: 1, endDate: 1 });

// Virtual for checking if rule is currently valid
rewardRuleSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.isActive && 
         (!this.startDate || this.startDate <= now) &&
         (!this.endDate || this.endDate >= now) &&
         (this.maxClaimsTotal === -1 || this.totalClaims < this.maxClaimsTotal);
});

module.exports = mongoose.model('RewardRule', rewardRuleSchema);