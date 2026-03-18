const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Order = require('../models/Order');
const userAuth = require('../middleware/userAuth');

const router = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '744419888014-0rtl9jedb19mmovos2rur2dm5i4nbt3n.apps.googleusercontent.com';
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const createToken = (user) => jwt.sign({
  id: user._id,
  email: user.email,
  fullName: user.fullName,
  role: 'user',
}, process.env.JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone || '',
  avatar: user.avatar || '',
  provider: user.provider,
  defaultAddress: user.defaultAddress || {},
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim() || '',
      provider: 'local',
    });

    const token = createToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    if (!payload || !email) {
      return res.status(400).json({ message: 'Invalid Google account data' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        fullName: payload.name || email.split('@')[0],
        email,
        avatar: payload.picture || '',
        googleId: payload.sub,
        provider: 'google',
      });
    } else {
      user.fullName = user.fullName || payload.name || user.fullName;
      user.avatar = payload.picture || user.avatar;
      user.googleId = payload.sub;
      user.provider = 'google';
      await user.save();
    }

    const token = createToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    res.status(401).json({ message: 'Google sign-in failed' });
  }
});

router.get('/me', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/me', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { fullName, phone, avatar, defaultAddress } = req.body;
    if (fullName?.trim()) user.fullName = fullName.trim();
    user.phone = phone?.trim() || '';
    user.avatar = avatar?.trim() || '';
    user.defaultAddress = {
      address: defaultAddress?.address?.trim() || '',
      city: defaultAddress?.city?.trim() || '',
      state: defaultAddress?.state?.trim() || '',
      zipCode: defaultAddress?.zipCode?.trim() || '',
    };

    await user.save();
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/me/orders', userAuth, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user.id },
        { 'shipping.email': req.user.email },
      ],
    }).sort({ createdAt: -1 }).populate('items.product', 'name image price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
