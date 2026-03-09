// Vercel serverless entry point
require('dotenv').config();
const serverless = require('serverless-http');
const connectDB = require('../lib/db');
const app = require('../lib/app');

let handler;

module.exports = async (req, res) => {
  await connectDB();
  if (!handler) handler = serverless(app);
  return handler(req, res);
};
