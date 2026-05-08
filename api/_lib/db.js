const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 5,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }
  try {
    cached.conn = await cached.promise;
    // Ensure indexes defined in models are created in the database
    const Product = require('./models/Product');
    await Product.syncIndexes();
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

module.exports = connectDB;
