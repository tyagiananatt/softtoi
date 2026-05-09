const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64Image - Base64 encoded image (data:image/jpeg;base64,...)
 * @param {string} folder - Cloudinary folder name (e.g., 'products', 'reviews')
 * @returns {Promise<string>} - Cloudinary URL
 */
async function uploadBase64Image(base64Image, folder = 'softtoi') {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' }, // max 1000x1000
        { quality: 'auto:good' }, // auto quality optimization
        { fetch_format: 'auto' }, // auto format (WebP when supported)
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Cloudinary URL
 */
async function deleteImage(imageUrl) {
  try {
    // Extract public_id from URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234/softtoi/abc123.jpg
    const parts = imageUrl.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
    // Don't throw - deletion failure shouldn't block the operation
  }
}

module.exports = {
  uploadBase64Image,
  deleteImage,
  cloudinary,
};
