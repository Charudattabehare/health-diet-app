const DailyLog = require('../models/DailyLog');
const { getIsInMemory, getMemoryStore } = require('../config/db');

const getTodayDateStr = () => {
  return new Date().toISOString().split('T')[0];
};

// @desc    Get today's daily log
// @route   GET /api/logs/today
// @access  Private
const getTodayLog = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const today = getTodayDateStr();
    const isInMemory = getIsInMemory();

    let log;
    if (isInMemory) {
      const store = getMemoryStore();
      log = store.logs.find(l => String(l.user) === String(userId) && l.date === today);
      if (!log) {
        log = { user: userId, date: today, waterGlasses: 0, completedMeals: [], completedWorkouts: [], weightKg: 70 };
        store.logs.push(log);
      }
    } else {
      log = await DailyLog.findOne({ user: userId, date: today });
      if (!log) {
        log = await DailyLog.create({ user: userId, date: today, waterGlasses: 0, completedMeals: [], completedWorkouts: [] });
      }
    }

    return res.json({ success: true, log });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update water intake glasses
// @route   POST /api/logs/water
// @access  Private
const updateWaterIntake = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { glasses } = req.body; // absolute number or delta
    const today = getTodayDateStr();
    const isInMemory = getIsInMemory();

    let log;
    if (isInMemory) {
      const store = getMemoryStore();
      log = store.logs.find(l => String(l.user) === String(userId) && l.date === today);
      if (!log) {
        log = { user: userId, date: today, waterGlasses: Math.max(0, glasses || 0), completedMeals: [], completedWorkouts: [] };
        store.logs.push(log);
      } else {
        log.waterGlasses = Math.max(0, glasses !== undefined ? glasses : log.waterGlasses + 1);
      }
    } else {
      log = await DailyLog.findOneAndUpdate(
        { user: userId, date: today },
        { $set: { waterGlasses: Math.max(0, glasses) } },
        { upsert: true, new: true }
      );
    }

    return res.json({ success: true, waterGlasses: log.waterGlasses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle meal completion status
// @route   POST /api/logs/meal
// @access  Private
const toggleMealLog = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { mealName } = req.body;
    const today = getTodayDateStr();
    const isInMemory = getIsInMemory();

    let log;
    if (isInMemory) {
      const store = getMemoryStore();
      log = store.logs.find(l => String(l.user) === String(userId) && l.date === today);
      if (!log) {
        log = { user: userId, date: today, waterGlasses: 0, completedMeals: [mealName], completedWorkouts: [] };
        store.logs.push(log);
      } else {
        if (log.completedMeals.includes(mealName)) {
          log.completedMeals = log.completedMeals.filter(m => m !== mealName);
        } else {
          log.completedMeals.push(mealName);
        }
      }
    } else {
      log = await DailyLog.findOne({ user: userId, date: today });
      if (!log) {
        log = await DailyLog.create({ user: userId, date: today, completedMeals: [mealName] });
      } else {
        const hasMeal = log.completedMeals.includes(mealName);
        if (hasMeal) {
          log.completedMeals = log.completedMeals.filter(m => m !== mealName);
        } else {
          log.completedMeals.push(mealName);
        }
        await log.save();
      }
    }

    return res.json({ success: true, completedMeals: log.completedMeals });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record daily weight
// @route   POST /api/logs/weight
// @access  Private
const logWeight = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { weightKg } = req.body;
    const today = getTodayDateStr();
    const isInMemory = getIsInMemory();

    let log;
    if (isInMemory) {
      const store = getMemoryStore();
      log = store.logs.find(l => String(l.user) === String(userId) && l.date === today);
      if (!log) {
        log = { user: userId, date: today, waterGlasses: 0, completedMeals: [], weightKg: Number(weightKg) };
        store.logs.push(log);
      } else {
        log.weightKg = Number(weightKg);
      }
    } else {
      log = await DailyLog.findOneAndUpdate(
        { user: userId, date: today },
        { $set: { weightKg: Number(weightKg) } },
        { upsert: true, new: true }
      );
    }

    return res.json({ success: true, weightKg: log.weightKg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTodayLog,
  updateWaterIntake,
  toggleMealLog,
  logWeight
};
