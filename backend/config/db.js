const mongoose = require('mongoose');

let isInMemoryMode = false;
const memoryStore = {
  users: [],
  profiles: [],
  logs: []
};

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/health_diet_db';
  try {
    // Attempt connecting to configured MongoDB (e.g. local mongod or Atlas)
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`✅ MongoDB Connected successfully: ${mongoose.connection.host}`);
    isInMemoryMode = false;
  } catch (error) {
    console.warn(`⚠️ Standard MongoDB port 27017 connection: ${error.message}`);
    console.log(`🚀 Starting embedded MongoDB Database Server automatically...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoMemoryInstance = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`🎉 Embedded MongoDB Database is LIVE and connected!`);
      isInMemoryMode = false;
    } catch (memErr) {
      console.warn(`⚠️ Running in fallback store mode: ${memErr.message}`);
      isInMemoryMode = true;
    }
  }
};

const getMemoryStore = () => memoryStore;
const getIsInMemory = () => isInMemoryMode;

module.exports = { connectDB, getMemoryStore, getIsInMemory };
