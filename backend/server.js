const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const cors = require("cors");

app.use(
  cors({
    origin: [
      "https://health-diet-app.netlify.app",
      "http://localhost:5173", // keeps local development working
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Health Care Diet & Exercise API',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("API is running"));

app.listen(PORT, () => {
  console.log(`✨ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
