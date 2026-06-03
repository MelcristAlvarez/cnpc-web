const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary'); // Pull in our Cloudinary config!

router.get('/profile', protect, getUserProfile);

// Added upload.single('profileImage') to intercept the file!
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile); 

module.exports = router;