const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  details: [{ type: String }],
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true, enum: ['keychains', 'soft-toys', 'flowers'] },
  image: { type: String, required: true },
  images: [{ type: String }],
  badge: { type: String },
  rating: { type: Number, default: 4.5, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
