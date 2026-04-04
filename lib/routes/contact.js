const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../utils/email');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    await sendContactEmail({ name, email, subject, message });
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact email error:', err.message);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;
