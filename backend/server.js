const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      'https://health-diet-app.netlify.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/diet', require('./routes/dietRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Root and health check
app.get('/', (req, res) => res.send('API is running'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Health Care Diet & Exercise API',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✨ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});