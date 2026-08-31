const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getIsInMemory, getMemoryStore } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_health_diet_jwt_key_2026_safe');

      if (getIsInMemory()) {
        const store = getMemoryStore();
        const user = store.users.find(u => u._id === decoded.id || u.id === decoded.id);
        if (!user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        req.user = user;
      } else {
        req.user = await User.findById(decoded.id).select('-passwordPin');
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'User not found in database' });
        }
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
