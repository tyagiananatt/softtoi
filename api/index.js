// Vercel serverless entry point
const mongoose = require('mongoose');
const dns = require('dns').promises;
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

// Resolve mongodb+srv:// to a direct mongodb:// URI by doing SRV + TXT DNS lookups.
// This bypasses the built-in SRV DNS resolution which can time out on some serverless
// platforms (Vercel), while still being fully dynamic (no hardcoded hostnames).
async function resolveSrvUri(uri) {
  if (!uri || !uri.startsWith('mongodb+srv://')) return uri;
  try {
    // Parse:  mongodb+srv://user:pass@cluster.mongodb.net/dbname?opts
    const withoutScheme = uri.slice('mongodb+srv://'.length);
    const atIdx = withoutScheme.indexOf('@');
    const creds = withoutScheme.slice(0, atIdx);           // user:pass
    const afterAt = withoutScheme.slice(atIdx + 1);        // cluster.mongodb.net/dbname?opts
    const slashIdx = afterAt.indexOf('/');
    const srvHost = afterAt.slice(0, slashIdx);             // cluster.mongodb.net
    const dbAndParams = afterAt.slice(slashIdx);            // /dbname?opts

    const [srvRecords, txtRecords] = await Promise.all([
      dns.resolveSrv(`_mongodb._tcp.${srvHost}`),
      dns.resolveTxt(srvHost).catch(() => []),
    ]);

    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');
    const txtOpts = (txtRecords[0] || []).join('');        // e.g. authSource=admin&replicaSet=...

    // Build direct URI; always add tls=true because Atlas requires TLS
    const sep = dbAndParams.includes('?') ? '&' : '?';
    const extraParams = txtOpts
      ? `${sep}${txtOpts}&tls=true&authSource=admin`
      : `${sep}tls=true&authSource=admin`;

    return `mongodb://${creds}@${hosts}${dbAndParams}${extraParams}`;
  } catch (e) {
    // If DNS resolution fails for any reason, fall back to the original SRV URI
    console.warn('SRV resolution failed, using original URI:', e.message);
    return uri;
  }
}

// DB connection — cached via global so it survives warm reuse between requests.
// readyState: 0=disconnected 1=connected 2=connecting 3=disconnecting
async function connectDB() {
  // Already connected — reuse the existing connection
  if (mongoose.connection.readyState === 1) return;

  // If the previous connection dropped (readyState 0) or we never connected,
  // clear any stale cached promise so we reconnect cleanly.
  if (mongoose.connection.readyState === 0) {
    global._dbPromise = null;
  }

  if (!global._dbPromise) {
    // Dynamically resolve SRV so DNS lookup happens with our known-good timeout,
    // not buried inside Mongoose's connection internals.
    const uri = await resolveSrvUri(process.env.MONGODB_URI);
    global._dbPromise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
        socketTimeoutMS: 8000,
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
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    return res.status(503).json({ message: 'Database connection failed. Please try again later.' });
  }
  return buildHandler()(req, res);
};
