const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Career', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Seminar', 'Other']
  },
  maxAttendees: {
    type: Number,
    required: true,
    min: 1
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  attendedCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'cancelled', 'completed'],
    default: 'active'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String
  },
  requirements: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  qrCode: {
    type: String
  },
  isRegistrationOpen: {
    type: Boolean,
    default: true
  },
  registrationDeadline: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
