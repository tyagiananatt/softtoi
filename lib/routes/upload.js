const express = require('express');
const router = express.Router();
const { uploadBase64Image } = require('../utils/cloudinary');
const authMiddleware = require('../middleware/auth');
const userAuth = require('../middleware/userAuth');

// POST upload image (admin or authenticated user)
router.post('/', async (req, res) => {
  try {
    const { image, folder } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    // Validate base64 format
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    // Upload to Cloudinary
    const folderName = folder || 'softtoi';
    const cloudinaryUrl = await uploadBase64Image(image, folderName);

    res.json({ url: cloudinaryUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message || 'Failed to upload image' });
  }
});

module.exports = router;
