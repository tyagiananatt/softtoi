// Vercel serverless entry point
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');

// Build the Express handler once and cache it across warm invocations
let handler = null;
function buildHandler() {
  if (handler) return handler;
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/api/products',   require('./_lib/routes/products'));
  app.use('/api/orders',     require('./_lib/routes/orders'));
  app.use('/api/categories', require('./_lib/routes/categories'));
  app.use('/api/admin',      require('./_lib/routes/admin'));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  });
  handler = serverless(app);
  return handler;
}

// DB connection — cached via global so it survives warm reuse between requests.
// On failure the promise is cleared so the next request retries automatically.
async function connectDB() {
  if (!global._dbPromise) {
    global._dbPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .catch((err) => {
        global._dbPromise = null; // allow retry on next request
        throw err;
      });
  }
  await global._dbPromise;
}

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    return res.status(503).json({ message: 'Database connection failed. Please try again later.' });
  }
  return buildHandler()(req, res);
};
