const mongoose = require('mongoose');

async function connectDB() {
  // Already connected — reuse
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  // If stuck in connecting/disconnecting, wait briefly then check again
  if (mongoose.connection.readyState === 2 || mongoose.connection.readyState === 3) {
    await new Promise(r => setTimeout(r, 1000));
    if (mongoose.connection.readyState === 1) return mongoose.connection;
  }

  // Disconnect cleanly before reconnecting
  if (mongoose.connection.readyState !== 0) {
    try { await mongoose.disconnect(); } catch (_) {}
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 30000,
    heartbeatFrequencyMS: 10000,
    maxPoolSize: 10,
    // Auto-reconnect on connection loss
    autoIndex: true,
  });

  // Run syncIndexes in background — don't block requests waiting for index builds
  const Product = require('./models/Product');
  Product.syncIndexes().catch(err => console.warn('syncIndexes warning:', err.message));

  return mongoose.connection;
}

// Listen for disconnection and log it so Render logs show the issue
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — will reconnect on next request');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});
mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;
