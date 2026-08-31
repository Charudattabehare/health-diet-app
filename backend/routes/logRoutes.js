const express = require('express');
const router = express.Router();
const { getTodayLog, updateWaterIntake, toggleMealLog, logWeight } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today', protect, getTodayLog);
router.post('/water', protect, updateWaterIntake);
router.post('/meal', protect, toggleMealLog);
router.post('/weight', protect, logWeight);

module.exports = router;
