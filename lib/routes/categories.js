const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    const cats = await Promise.all(categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat.slug });
      return { ...cat.toObject(), productCount: count };
    }));
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST — create a new category (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const category = new Category({ name, slug, description, image });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
