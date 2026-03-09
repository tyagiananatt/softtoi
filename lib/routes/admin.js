const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

// POST login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET verify token
router.get('/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// GET dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [orders, products] = await Promise.all([
      Order.find(),
      Product.find(),
    ]);
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('items.product', 'name');
    const statusBreakdown = {};
    orders.forEach(o => { statusBreakdown[o.status] = (statusBreakdown[o.status] || 0) + 1; });
    const categoryBreakdown = {};
    products.forEach(p => { categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1; });
    res.json({
      totalRevenue,
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders,
      recentOrders,
      statusBreakdown,
      categoryBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
