const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order  = require('../models/Order');
const Product = require('../models/Product');
const userAuth = require('../middleware/userAuth');
const authMiddleware = require('../middleware/auth');

// GET reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET current user's reviews
router.get('/my', userAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name _id')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all reviews (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
      .populate('product', 'name').populate('user', 'fullName email');
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create review (must have bought the product)
router.post('/', userAuth, async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    if (!productId || !orderId || !rating || !comment)
      return res.status(400).json({ message: 'All fields required' });

    // Verify user bought this product — check by user ID or by email
    const order = await Order.findOne({
      _id: orderId,
      $or: [
        { user: req.user.id },
        { 'shipping.email': req.user.email },
      ],
      status: { $in: ['delivered', 'shipped', 'confirmed', 'processing'] },
    });
    if (!order) return res.status(403).json({ message: 'You can only review products you have purchased' });

    // Verify the product is actually in this order
    const hasProduct = order.items.some(item =>
      String(item.product) === String(productId)
    );
    if (!hasProduct) return res.status(403).json({ message: 'This product is not in your order' });

    // Check duplicate
    const existing = await Review.findOne({ product: productId, user: req.user.id });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({
      product: productId, user: req.user.id, order: orderId,
      rating, comment, userName: req.user.fullName || 'Customer',
      images: req.body.images || [],
    });

    // Update product rating average
    const all = await Review.find({ product: productId });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(productId, { rating: Math.round(avg * 10) / 10, reviewCount: all.length });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already reviewed this product' });
    res.status(400).json({ message: err.message });
  }
});

// PUT update review (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, { rating: req.body.rating, comment: req.body.comment }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    // Recalculate product rating
    const all = await Review.find({ product: updated.product });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Product.findByIdAndUpdate(updated.product, { rating: Math.round(avg * 10) / 10, reviewCount: all.length });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE review (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    const all = await Review.find({ product: deleted.product });
    const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 4.5;
    await Product.findByIdAndUpdate(deleted.product, { rating: Math.round(avg * 10) / 10, reviewCount: all.length });
    res.json({ message: 'Review deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
