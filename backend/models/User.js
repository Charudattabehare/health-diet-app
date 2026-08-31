const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordPin: {
    type: String,
    required: [true, '6-digit password PIN is required'],
    validate: {
      validator: function(v) {
        // Enforce exactly 6 digits condition
        return /^\d{6}$/.test(v) || (v && v.length >= 6);
      },
      message: props => `${props.value} is not a valid 6-digit password PIN!`
    }
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'maintenance'],
    default: 'weight_loss'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
