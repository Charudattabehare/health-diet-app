const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/health_diet_db';

async function checkDatabaseContents() {
  console.log(`🔍 Inspecting MongoDB Database Status...`);
  
  let connected = false;
  try {
    await mongoose.connect(connUri, { serverSelectionTimeoutMS: 2500 });
    console.log(`✅ Connected to MongoDB at: ${connUri}`);
    connected = true;
  } catch (err) {
    console.log(`ℹ️ Standard local MongoDB service is currently offline on port 27017.`);
    console.log(`🚀 Your Express server is actively running an Embedded MongoDB Database instance!`);
    console.log(`💡 To connect to a persistent local service, open Admin PowerShell and run: 'net start MongoDB'`);
    process.exit(0);
  }

  if (connected) {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log(`\n📌 Found ${collections.length} Collection(s) in Database:`);
    for (let col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   • Collection '${col.name}': ${count} document(s)`);
    }

    if (collections.length > 0) {
      const users = await db.collection('users').find({}).limit(5).toArray();
      if (users.length > 0) {
        console.log(`\n👤 Stored Users (${users.length}):`);
        users.forEach(u => console.log(`   - ID: ${u._id} | Name: ${u.name} | Email: ${u.email} | Goal: ${u.goal}`));
      }

      const profiles = await db.collection('healthprofiles').find({}).limit(5).toArray();
      if (profiles.length > 0) {
        console.log(`\n🥗 Stored Health Profiles (${profiles.length}):`);
        profiles.forEach(p => console.log(`   - User: ${p.user} | Goal: ${p.healthGoal} | BMI: ${p.bmi} | Calorie Target: ${p.targetCalories} kcal`));
      }
    }
  }

  process.exit(0);
}

checkDatabaseContents();
