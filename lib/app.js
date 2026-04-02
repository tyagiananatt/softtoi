const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();

app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://softtoi.vercel.app',
    'https://softtoi.shop',
    'https://www.softtoi.shop',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
