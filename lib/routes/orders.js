const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const optionalAuth = require('../middleware/optionalAuth');
const authMiddleware = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/email');

const generateOrderId = () => `ST-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

// GET orders (admin: all; user: by email query)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { email, status, search } = req.query;
    let query = {};
    const isAdminRequest = req.headers['x-softtoi-admin'] === 'true' && !!req.admin;

    if (isAdminRequest) {
      query = {};
    } else if (req.user) {
      query.$or = [
        { user: req.user.id },
        { 'shipping.email': req.user.email },
      ];
    } else if (email) {
      query['shipping.email'] = email;
    } else {
      return res.status(400).json({ message: 'Email is required to view guest orders' });
    }

    if (status && status !== 'all') query.status = status;
    if (search) {
      const searchQuery = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shipping.firstName': { $regex: search, $options: 'i' } },
        { 'shipping.lastName': { $regex: search, $options: 'i' } },
        { 'shipping.email': { $regex: search, $options: 'i' } },
      ];
      query = Object.keys(query).length ? { $and: [query, { $or: searchQuery }] } : { $or: searchQuery };
    }
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('items.product', 'name image price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single order
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const isAdminRequest = req.headers['x-softtoi-admin'] === 'true' && !!req.admin;
    const belongsToUser = req.user && (
      String(order.user || '') === req.user.id || order.shipping?.email === req.user.email
    );
    if (!isAdminRequest && !belongsToUser) {
      return res.status(403).json({ message: 'You are not allowed to view this order' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create order
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { items, shipping, subtotal, shippingCost, total, paymentMethod } = req.body;
    const order = new Order({
      orderId: generateOrderId(),
      items,
      user: req.user?.id || null,
      shipping: {
        ...shipping,
        email: shipping?.email || req.user?.email || '',
      },
      subtotal,
      shippingCost,
      total,
      paymentMethod: paymentMethod || 'COD',
    });
    const saved = await order.save();
    // Send confirmation email (non-blocking — don't fail order if email fails)
    sendOrderConfirmation(saved).catch(err => console.error('Order email failed:', err.message));
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update order status (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
