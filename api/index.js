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
  const corsOptions = {
    origin: ['https://softoi.shop', 'https://www.softoi.shop', 'https://softtoi.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use('/api/products',   require('./_lib/routes/products'));
  app.use('/api/orders',     require('./_lib/routes/orders'));
  app.use('/api/categories', require('./_lib/routes/categories'));
  app.use('/api/users',      require('./_lib/routes/users'));
  app.use('/api/admin',      require('./_lib/routes/admin'));
  app.use('/api/contact',    require('./_lib/routes/contact'));
  app.use('/api/reviews',    require('./_lib/routes/reviews'));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  });
  handler = serverless(app);
  return handler;
}

// DB connection — cached via global so it survives warm reuse between requests.
// readyState: 0=disconnected 1=connected 2=connecting 3=disconnecting
async function connectDB() {
  // Already connected — reuse the existing connection
  if (mongoose.connection.readyState === 1) return;

  // If the previous connection dropped, clear stale promise so we reconnect cleanly
  if (mongoose.connection.readyState === 0) {
    global._dbPromise = null;
  }

  if (!global._dbPromise) {
    // Let Mongoose + the MongoDB driver handle SRV resolution natively.
    // Do NOT manually resolve SRV to IPs — Atlas rotates nodes and cached IPs go stale.
    global._dbPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 5,
      })
      .catch((err) => {
        global._dbPromise = null; // allow retry on next request
        throw err;
      });
  }

  await global._dbPromise;
}

module.exports = async (req, res) => {
  // Health check bypasses DB so we can always verify the function is alive
  if (req.url === '/api/health' || req.url === '/api/health/') {
    return res.json({ status: 'ok', time: new Date().toISOString() });
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    return res.status(503).json({
      message: 'Database connection failed',
      detail: err.message,
    });
  }
  return buildHandler()(req, res);
};
