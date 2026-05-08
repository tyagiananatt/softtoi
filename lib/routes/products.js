const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, featured } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else sortOption.featured = -1;

    const limit = parseInt(req.query.limit) || 0;
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(limit)
      .select('-images -description -details')
      .maxTimeMS(8000)  // fail after 8s instead of hanging forever
      .lean();
    // For base64 images, replace with a lightweight URL endpoint; for URL images, keep as-is
    const base = `${req.protocol}://${req.get('host')}`;
    products.forEach(p => {
      if (p.image && p.image.startsWith('data:')) {
        p.imageUrl = `${base}/api/products/${p._id}/image`;
        delete p.image;
      } else {
        p.imageUrl = p.image;
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET product image — serves the base64 image as binary with long cache headers
router.get('/:id/image', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('image').lean();
    if (!product || !product.image) return res.status(404).send('Not found');
    const match = product.image.match(/^data:(.+);base64,(.+)$/);
    if (!match) return res.redirect(product.image); // already a URL
    const contentType = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(buffer);
  } catch (err) {
    res.status(500).send('Error');
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    // Fetch sibling variants if this product belongs to a variant group
    let variants = [];
    if (product.variantGroup) {
      variants = await Product.find({ variantGroup: product.variantGroup })
        .select('_id name variantLabel image price inStock')
        .lean();
    }
    res.json({ ...product.toObject(), variants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create product (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const product = new Product({ ...req.body, slug });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update product (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE product (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
