const HealthProfile = require('../models/HealthProfile');
const { getIsInMemory, getMemoryStore } = require('../config/db');
const {
  calculateBmi,
  calculateBmr,
  calculateTdee,
  calculateTargetCalories,
  calculateMacros,
  generateMealPlan,
  generateWorkoutPlan,
  getDietGuidelines,
  getExerciseGuidelines
} = require('../utils/dietCalculator');

// @desc    Generate and save personalized diet & exercise plan
// @route   POST /api/diet/generate
// @access  Private
const generateDietPlan = async (req, res) => {
  try {
    const {
      age,
      gender,
      heightCm,
      currentWeightKg,
      targetWeightKg,
      activityLevel,
      dietPreference,
      healthGoal
    } = req.body;

    const userId = req.user._id || req.user.id;

    if (!age || !gender || !heightCm || !currentWeightKg || !targetWeightKg || !healthGoal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide age, gender, height, current weight, target weight, and health goal.'
      });
    }

    // Calculations
    const bmiData = calculateBmi(Number(currentWeightKg), Number(heightCm));
    const bmr = calculateBmr(Number(currentWeightKg), Number(heightCm), Number(age), gender);
    const tdee = calculateTdee(bmr, activityLevel || 'moderate');
    const targetCalories = calculateTargetCalories(tdee, healthGoal);
    const macros = calculateMacros(targetCalories, healthGoal, dietPreference || 'vegetarian');
    
    const mealPlan = generateMealPlan(targetCalories, healthGoal, dietPreference || 'vegetarian');
    const workoutPlan = generateWorkoutPlan(healthGoal, activityLevel || 'moderate');
    const dietGuidelines = getDietGuidelines(healthGoal);
    const exerciseGuidelines = getExerciseGuidelines(healthGoal);

    const profileData = {
      user: userId,
      age: Number(age),
      gender,
      heightCm: Number(heightCm),
      currentWeightKg: Number(currentWeightKg),
      targetWeightKg: Number(targetWeightKg),
      activityLevel: activityLevel || 'moderate',
      dietPreference: dietPreference || 'vegetarian',
      healthGoal,
      bmi: bmiData.bmi,
      bmiStatus: bmiData.status,
      bmiColor: bmiData.color,
      bmr,
      tdee,
      targetCalories,
      macros,
      mealPlan,
      workoutPlan,
      dietGuidelines,
      exerciseGuidelines,
      updatedAt: new Date()
    };

    const isInMemory = getIsInMemory();

    if (isInMemory) {
      const store = getMemoryStore();
      const existingIdx = store.profiles.findIndex(p => String(p.user) === String(userId));
      if (existingIdx >= 0) {
        store.profiles[existingIdx] = { ...store.profiles[existingIdx], ...profileData };
      } else {
        store.profiles.push({ _id: 'prof_' + Date.now(), ...profileData });
      }
    } else {
      await HealthProfile.findOneAndUpdate(
        { user: userId },
        profileData,
        { upsert: true, new: true }
      );
    }

    return res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Error generating diet plan:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error generating diet plan' });
  }
};

// @desc    Get current user diet & health profile
// @route   GET /api/diet/current
// @access  Private
const getCurrentDietPlan = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isInMemory = getIsInMemory();

    let profile;

    if (isInMemory) {
      const store = getMemoryStore();
      profile = store.profiles.find(p => String(p.user) === String(userId));
    } else {
      profile = await HealthProfile.findOne({ user: userId });
    }

    if (!profile) {
      // Generate default profile for Weight Loss if none exists yet
      const defaultGoal = req.user.goal || 'weight_loss';
      const bmiData = calculateBmi(70, 175);
      const bmr = calculateBmr(70, 175, 25, 'male');
      const tdee = calculateTdee(bmr, 'moderate');
      const targetCalories = calculateTargetCalories(tdee, defaultGoal);
      const macros = calculateMacros(targetCalories, defaultGoal, 'vegetarian');

      profile = {
        age: 25,
        gender: 'male',
        heightCm: 175,
        currentWeightKg: 70,
        targetWeightKg: defaultGoal === 'weight_loss' ? 65 : 75,
        activityLevel: 'moderate',
        dietPreference: 'vegetarian',
        healthGoal: defaultGoal,
        bmi: bmiData.bmi,
        bmiStatus: bmiData.status,
        bmiColor: bmiData.color,
        bmr,
        tdee,
        targetCalories,
        macros,
        mealPlan: generateMealPlan(targetCalories, defaultGoal, 'vegetarian'),
        workoutPlan: generateWorkoutPlan(defaultGoal, 'moderate'),
        dietGuidelines: getDietGuidelines(defaultGoal),
        exerciseGuidelines: getExerciseGuidelines(defaultGoal)
      };
    }

    return res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching current diet plan:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error fetching diet plan' });
  }
};

module.exports = {
  generateDietPlan,
  getCurrentDietPlan
};
