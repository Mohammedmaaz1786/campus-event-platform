const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  settings: {
    allowStudentRegistration: {
      type: Boolean,
      default: true
    },
    requireApprovalForEvents: {
      type: Boolean,
      default: false
    },
    maxEventsPerStudent: {
      type: Number,
      default: 10
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  departments: [{
    name: {
      type: String,
      required: true
    },
    head: {
      type: String
    },
    contact: {
      type: String
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('College', collegeSchema);
