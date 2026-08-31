const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  waterGlasses: {
    type: Number,
    default: 0
  },
  weightKg: {
    type: Number
  },
  completedMeals: [String], // Meal names checked off
  completedWorkouts: [String], // Exercise names checked off
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyLog', dailyLogSchema);
