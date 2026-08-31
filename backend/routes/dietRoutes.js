const express = require('express');
const router = express.Router();
const { generateDietPlan, getCurrentDietPlan } = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateDietPlan);
router.get('/current', protect, getCurrentDietPlan);

module.exports = router;
