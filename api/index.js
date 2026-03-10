// Vercel serverless entry point
const serverless = require('serverless-http');

let handler;

module.exports = async (req, res) => {
  // Health check — no DB needed
  if (req.url === '/api/health') {
    return res.status(200).json({
      status: 'ok',
      hasMongoURI: !!process.env.MONGODB_URI,
      uriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT SET',
      hasJwtSecret: !!process.env.JWT_SECRET,
      timestamp: new Date().toISOString(),
    });
  }

  const connectDB = require('./_lib/db');
  const app = require('./_lib/app');

  try {
    await connectDB();
  } catch (err) {
    console.error('DB Error:', err.message);
    return res.status(503).json({ message: 'Database connection failed: ' + err.message });
  }

  if (!handler) handler = serverless(app);
  return handler(req, res);
};
