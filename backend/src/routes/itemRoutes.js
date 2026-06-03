const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { getApprovedItems, getPendingItems, createItem, approveItem, deleteItem } = require('../controllers/itemController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); // Import our security guards

// PUBLIC: Anyone can view the approved storefront
router.get('/approved', getApprovedItems);

// PROTECTED: You MUST be logged in to submit a new item
router.post('/', protect, upload.single('image'), createItem); 

// ADMIN ONLY: Only Admin accounts can view pending, approve, or delete items
router.get('/pending', protect, adminOnly, getPendingItems);
router.put('/:id/approve', protect, adminOnly, approveItem);
router.delete('/:id', protect, adminOnly, deleteItem); 

module.exports = router;