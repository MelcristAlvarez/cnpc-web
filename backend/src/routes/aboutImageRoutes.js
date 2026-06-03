const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); 
const { getAboutImages, addAboutImage, deleteAboutImage } = require('../controllers/aboutImageController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); 

router.get('/', getAboutImages);
router.post('/', protect, adminOnly, upload.single('image'), addAboutImage);
router.delete('/:id', protect, adminOnly, deleteAboutImage);

module.exports = router;