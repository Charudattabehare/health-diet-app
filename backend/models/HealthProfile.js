const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  age: { type: Number, required: true, min: 12, max: 100 },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  heightCm: { type: Number, required: true, min: 100, max: 250 },
  currentWeightKg: { type: Number, required: true, min: 30, max: 250 },
  targetWeightKg: { type: Number, required: true, min: 30, max: 250 },
  activityLevel: { 
    type: String, 
    enum: ['sedentary', 'light', 'moderate', 'active', 'extreme'],
    default: 'moderate' 
  },
  dietPreference: { 
    type: String, 
    enum: ['vegetarian', 'non_vegetarian', 'vegan', 'keto', 'high_protein'],
    default: 'vegetarian' 
  },
  healthGoal: { 
    type: String, 
    enum: ['weight_loss', 'weight_gain', 'maintenance'],
    required: true 
  },
  bmi: Number,
  bmr: Number,
  tdee: Number,
  targetCalories: Number,
  macros: {
    proteinGrams: Number,
    carbsGrams: Number,
    fatGrams: Number
  },
  mealPlan: Array,
  workoutPlan: Array,
  dietGuidelines: Array,
  exerciseGuidelines: Array,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthProfile', healthProfileSchema);
