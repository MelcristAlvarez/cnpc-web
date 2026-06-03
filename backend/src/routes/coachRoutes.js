const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); 

// CRITICAL: We make sure updateCoach is imported here!
const { 
  getApprovedCoaches, getPendingCoaches, createCoachApp, approveCoach, updateCoach, deleteCoach 
} = require('../controllers/coachController');

const { protect, adminOnly } = require('../middlewares/authMiddleware'); 

router.get('/approved', getApprovedCoaches);
router.post('/', protect, upload.single('image'), createCoachApp);
router.get('/pending', protect, adminOnly, getPendingCoaches);
router.put('/:id/approve', protect, adminOnly, approveCoach);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCoach);
router.delete('/:id', protect, adminOnly, deleteCoach);

module.exports = router;