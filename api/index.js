// Vercel serverless entry point
let handler;
let dbConnected = false;

module.exports = async (req, res) => {
  // Health check — zero imports needed
  if (req.url && req.url.includes('/api/health')) {
    return res.status(200).json({ status: 'ok', time: new Date().toISOString() });
  }

  // Lazy-load everything on first real request
  if (!handler) {
    const serverless = require('serverless-http');
    const mongoose = require('mongoose');
    const express = require('express');
    const cors = require('cors');

    const app = express();
    app.use(cors({ origin: true, credentials: true }));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    app.use('/api/products', require('./_lib/routes/products'));
    app.use('/api/orders', require('./_lib/routes/orders'));
    app.use('/api/categories', require('./_lib/routes/categories'));
    app.use('/api/admin', require('./_lib/routes/admin'));
    app.get('/api/health', (r, s) => s.json({ status: 'ok' }));
    app.use((err, r, s, n) => { console.error(err); s.status(500).json({ message: 'Server error' }); });

    handler = serverless(app);

    // Connect to DB — use direct hosts to avoid SRV DNS timeout on Vercel
    if (!dbConnected) {
      try {
        // Convert mongodb+srv:// to direct connection if SRV
        let uri = process.env.MONGODB_URI;
        if (uri && uri.startsWith('mongodb+srv://')) {
          const afterSrv = uri.replace('mongodb+srv://', '');
          const atIdx = afterSrv.indexOf('@');
          const creds = afterSrv.substring(0, atIdx);
          const rest = afterSrv.substring(atIdx + 1);
          const slashIdx = rest.indexOf('/');
          const dbAndParams = rest.substring(slashIdx);
          uri = `mongodb://${creds}@ac-i8wgyby-shard-00-00.yv52lvm.mongodb.net:27017,ac-i8wgyby-shard-00-01.yv52lvm.mongodb.net:27017,ac-i8wgyby-shard-00-02.yv52lvm.mongodb.net:27017${dbAndParams}&ssl=true&authSource=admin&replicaSet=atlas-k0gitt-shard-0`;
        }
        await mongoose.connect(uri, {
          bufferCommands: false,
          serverSelectionTimeoutMS: 10000,
          connectTimeoutMS: 10000,
        });
        dbConnected = true;
      } catch (err) {
        console.error('DB connect failed:', err.message);
        return res.status(503).json({ message: 'DB connection failed: ' + err.message });
      }
    }
  }

  return handler(req, res);
};
