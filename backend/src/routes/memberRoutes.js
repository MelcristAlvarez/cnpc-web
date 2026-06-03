const express = require('express');
const router = express.Router();
const { getAllMembers, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); 

router.get('/', getAllMembers); // Publicly viewable
router.post('/', protect, adminOnly, createMember);
router.put('/:id', protect, adminOnly, updateMember);
router.delete('/:id', protect, adminOnly, deleteMember);

module.exports = router;