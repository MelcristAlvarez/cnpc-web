const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Authenticate with your Cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure the storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cnpc_uploads', // This will keep your Cloudinary dashboard organized
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
    // Optional: You can force Cloudinary to resize massive images to save bandwidth
    // transformation: [{ width: 1000, height: 1000, crop: 'limit' }] 
  },
});

// 3. Create the upload middleware we will use in our routes
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };