// Vercel serverless entry point
const serverless = require('serverless-http');
const mongoose = require('mongoose');

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// Inline the Express app to avoid any module resolution issues
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasMongoURI: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', require('./_lib/routes/products'));
app.use('/api/orders', require('./_lib/routes/orders'));
app.use('/api/categories', require('./_lib/routes/categories'));
app.use('/api/admin', require('./_lib/routes/admin'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

let handler;

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB Error:', err.message);
    // Still allow health check without DB
    if (req.url && req.url.startsWith('/api/health')) {
      return res.status(200).json({ status: 'db_error', error: err.message });
    }
    return res.status(503).json({ message: 'Database error: ' + err.message });
  }

  if (!handler) handler = serverless(app);
  return handler(req, res);
};
