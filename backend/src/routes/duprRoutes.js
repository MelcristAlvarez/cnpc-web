const express = require('express');
const router = express.Router();
const { getStandings, addPlayer, updatePlayer, deletePlayer } = require('../controllers/duprController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Public route for the storefront
router.get('/', getStandings);

// Protected Admin Routes for CRUD
router.post('/', protect, adminOnly, addPlayer);
router.put('/:id', protect, adminOnly, updatePlayer);
router.delete('/:id', protect, adminOnly, deletePlayer);

module.exports = router;