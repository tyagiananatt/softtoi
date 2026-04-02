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

    // Race DNS lookups against a 3-second timeout so cold starts don't hang
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DNS timeout')), 3000)
    );
    const result = await Promise.race([
      Promise.all([
        dns.resolveSrv(`_mongodb._tcp.${srvHost}`),
        dns.resolveTxt(srvHost).catch(() => []),
      ]),
      timeout,
    ]).catch(() => null);

    if (!result || !result[0] || result[0].length === 0) {
      console.warn('SRV resolution returned no records, falling back to original URI');
      return uri;
    }

    const [srvRecords, txtRecords] = result;
    const hosts = srvRecords.map((r) => `${r.name}:${r.port}`).join(',');
    const txtOpts = (txtRecords[0] || []).join(''); // e.g. authSource=admin&replicaSet=...

    // Collect all params from the original URI and TXT record, then deduplicate.
    // Build a merged params map so no option ever appears twice.
    const merged = new Map();

    // Parse params already in the original URI (e.g. ?retryWrites=true&w=majority)
    const qIdx = dbAndParams.indexOf('?');
    const dbName = qIdx === -1 ? dbAndParams : dbAndParams.slice(0, qIdx);
    const origParams = qIdx === -1 ? '' : dbAndParams.slice(qIdx + 1);
    for (const pair of origParams.split('&').filter(Boolean)) {
      const [k, v] = pair.split('=');
      merged.set(k, v);
    }
    // Merge TXT record options (Atlas puts replicaSet + authSource here)
    for (const pair of txtOpts.split('&').filter(Boolean)) {
      const [k, v] = pair.split('=');
      merged.set(k, v);
    }
    // Always need tls=true for Atlas direct connections
    merged.set('tls', 'true');

    const queryString = Array.from(merged.entries()).map(([k, v]) => `${k}=${v}`).join('&');
    const directUri = `mongodb://${creds}@${hosts}${dbName}?${queryString}`;
    console.log(`SRV resolved to ${srvRecords.length} host(s)`);
    return directUri;
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
  // Health check bypasses DB so we can always verify the function is alive
  if (req.url === '/api/health' || req.url === '/api/health/') {
    return res.json({ status: 'ok', time: new Date().toISOString() });
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err.message);
    // Return the real error in non-production so it's debuggable
    return res.status(503).json({
      message: 'Database connection failed',
      detail: err.message,
    });
  }
  return buildHandler()(req, res);
};
