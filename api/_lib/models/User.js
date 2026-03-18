const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, default: '' },
  phone: { type: String, default: '', trim: true },
  avatar: { type: String, default: '' },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true },
  defaultAddress: { type: addressSchema, default: () => ({}) },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
