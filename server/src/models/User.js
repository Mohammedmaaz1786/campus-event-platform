const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'faculty'],
    default: 'student'
  },
  department: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  college: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  eventsAttended: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });

module.exports = mongoose.model('User', userSchema);
