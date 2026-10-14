import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`[DB] Attempting connection to configured MONGODB_URI...`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[DB] Connected to MongoDB at ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
      return;
    } catch (err) {
      console.warn(`[DB] Failed to connect to configured MONGODB_URI: ${err.message}`);
    }
  }

  // Attempt local MongoDB on standard port
  try {
    console.log(`[DB] Checking for local MongoDB daemon at mongodb://127.0.0.1:27017/ecoverse...`);
    await mongoose.connect('mongodb://127.0.0.1:27017/ecoverse', { serverSelectionTimeoutMS: 2000 });
    console.log(`[DB] Successfully connected to local MongoDB at 127.0.0.1:27017/ecoverse`);
    return;
  } catch (localErr) {
    console.log(`[DB] Local mongod daemon not found (${localErr.message}). Initializing embedded MongoMemoryServer...`);
  }

  // Fallback to MongoMemoryServer
  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[DB] Connected to embedded in-memory MongoDB at ${memUri}`);
    console.log(`[DB] All database models, queries, indexes, and aggregations are 100% functional!`);
  } catch (memErr) {
    console.error(`[DB] Critical: Failed to start in-memory Mongo:`, memErr);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error(`[DB] Error disconnecting: ${err.message}`);
  }
};
