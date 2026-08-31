const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsInMemory, getMemoryStore } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_health_diet_jwt_key_2026_safe', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, passwordPin, goal } = req.body;

    if (!name || !email || !passwordPin) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and 6-digit password PIN' });
    }

    // 6-digit password condition verification
    const pinStr = String(passwordPin).trim();
    if (!/^\d{6}$/.test(pinStr) && pinStr.length !== 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be exactly a 6-digit PIN (e.g. 123456 or 987654)' 
      });
    }

    const isInMemory = getIsInMemory();

    if (isInMemory) {
      const store = getMemoryStore();
      const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pinStr, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        passwordPin: hashedPassword,
        goal: goal || 'weight_loss',
        createdAt: new Date()
      };

      store.users.push(newUser);
      const token = generateToken(newUser._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          goal: newUser.goal
        }
      });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pinStr, salt);

      const user = await User.create({
        name,
        email,
        passwordPin: hashedPassword,
        goal: goal || 'weight_loss'
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          goal: user.goal
        }
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Registration Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, passwordPin } = req.body;

    if (!email || !passwordPin) {
      return res.status(400).json({ success: false, message: 'Please provide email and 6-digit password PIN' });
    }

    const pinStr = String(passwordPin).trim();
    if (!/^\d{6}$/.test(pinStr) && pinStr.length !== 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be a valid 6-digit PIN' 
      });
    }

    const isInMemory = getIsInMemory();

    if (isInMemory) {
      const store = getMemoryStore();
      const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials or user not registered' });
      }

      const isMatch = await bcrypt.compare(pinStr, user.passwordPin);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect 6-digit PIN' });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          goal: user.goal
        }
      });
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(pinStr, user.passwordPin);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect 6-digit PIN' });
      }

      const token = generateToken(user._id);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          goal: user.goal
        }
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server Login Error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user._id || req.user.id,
      name: req.user.name,
      email: req.user.email,
      goal: req.user.goal
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
