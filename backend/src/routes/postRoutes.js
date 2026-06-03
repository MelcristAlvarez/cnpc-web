const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); 
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); 

router.get('/', getPosts);

// Make sure BOTH of these are set to 20!
router.post('/', protect, adminOnly, upload.array('images', 20), createPost);
router.put('/:id', protect, adminOnly, upload.array('images', 20), updatePost); 

router.delete('/:id', protect, adminOnly, deletePost);

module.exports = router;