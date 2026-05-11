const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configure Cloudinary with your .env credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Set up the storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'auction_items', // The folder name in your Cloudinary account
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] // Restrict file types
    }
});

// 3. Initialize Multer with this storage
const upload = multer({ storage: storage });

module.exports = upload;