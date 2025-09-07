const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled', 'attended', 'no-show'],
    default: 'registered'
  },
  checkInTime: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to ensure unique registration per student per event
registrationSchema.index({ student: 1, event: 1 }, { unique: true });
registrationSchema.index({ event: 1 });
registrationSchema.index({ student: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
