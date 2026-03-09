// Vercel serverless entry point
require('dotenv').config();
const serverless = require('serverless-http');
const connectDB = require('../lib/db');
const app = require('../lib/app');

let handler;

module.exports = async (req, res) => {
  // Health check — no DB needed
  if (req.url === '/api/health') {
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DB connection timeout')), 8000)
      ),
    ]);
  } catch (err) {
    console.error('DB Error:', err.message);
    return res.status(503).json({ message: 'Service unavailable. Please try again.' });
  }

  if (!handler) handler = serverless(app);
  return handler(req, res);
};
