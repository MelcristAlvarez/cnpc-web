const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); 
const { getApprovedCourts, getPendingCourts, createCourt, approveCourt, updateCourt, deleteCourt } = require('../controllers/courtController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); 

// Public Routes (Anyone can fetch approved courts or submit a suggestion)
router.get('/approved', getApprovedCourts);
router.post('/', upload.array('images', 5), createCourt);

// Admin Routes (Manage, edit, delete, approve)
router.get('/pending', protect, adminOnly, getPendingCourts);
router.put('/:id/approve', protect, adminOnly, approveCourt);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateCourt);
router.delete('/:id', protect, adminOnly, deleteCourt);

module.exports = router;