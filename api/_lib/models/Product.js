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

// Indexes on all sort fields so MongoDB uses index scans instead of in-memory sorts.
// This prevents the 32MB sort memory limit from being exceeded on Atlas M0.
productSchema.index({ featured: -1 });
productSchema.index({ price: 1 });
productSchema.index({ price: -1 });
productSchema.index({ rating: -1 });
productSchema.index({ category: 1, featured: -1 });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
