const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Event Identification
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
  
  // Event Details
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'academic', 'hackathon', 'sports', 'cultural', 'workshop',
      'seminar', 'volunteering', 'competition', 'social', 'other'
    ],
    required: true
  },
  
  // Event Schedule
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date
  },
  
  // Location
  venue: {
    type: String,
    required: true,
    trim: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  meetingLink: String,
  
  // Rewards Configuration
  attendanceReward: {
    type: Number,
    default: 0,
    min: 0
  },
  participationReward: {
    type: Number,
    default: 0,
    min: 0
  },
  winnerRewards: [{
    position: String, // '1st', '2nd', '3rd', 'participant'
    tokens: Number,
    nftBadge: {
      name: String,
      description: String,
      imageUrl: String
    }
  }],
  
  // Registration & Participation
  maxParticipants: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  registrationFee: {
    type: Number,
    default: 0,
    min: 0
  },
  requiresApproval: {
    type: Boolean,
    default: false
  },
  
  // Event Status
  status: {
    type: String,
    enum: ['draft', 'open', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  
  // Participants
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    },
    participationStatus: {
      type: String,
      enum: ['registered', 'attended', 'completed', 'no_show'],
      default: 'registered'
    },
    position: String, // for competitions
    tokensAwarded: {
      type: Number,
      default: 0
    },
    feedback: String,
    metadata: Object
  }],
  
  // Organizers
  organizers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['primary', 'co-organizer', 'volunteer'],
      default: 'co-organizer'
    }
  }],
  
  // Media and Resources
  bannerImage: String, // IPFS hash or URL
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  
  // Administrative
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Metadata
  tags: [String],
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
eventSchema.index({ code: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ 'participants.user': 1 });

// Virtuals
eventSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  return this.status === 'open' && 
         (!this.registrationDeadline || this.registrationDeadline >= now) &&
         (this.maxParticipants === -1 || this.participants.length < this.maxParticipants);
});

eventSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

module.exports = mongoose.model('Event', eventSchema);