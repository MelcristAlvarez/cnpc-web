const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { getApprovedItems, getPendingItems, getAllItems, getUserItems, createItem, approveItem, deleteItem } = require('../controllers/itemController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// PUBLIC
router.get('/approved', getApprovedItems);

// PROTECTED (Logged in users)
router.get('/my-items', protect, getUserItems); // Fetches items for the profile
router.post('/', protect, upload.single('image'), createItem); 
router.delete('/:id', protect, deleteItem); // Removed adminOnly!

// ADMIN ONLY
router.get('/all', protect, adminOnly, getAllItems); // Admin Marketplace view
router.get('/pending', protect, adminOnly, getPendingItems);
router.put('/:id/approve', protect, adminOnly, approveItem);

module.exports = router;