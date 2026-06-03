const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { 
  getApprovedProducts, 
  getPendingProducts, 
  createProduct, 
  updateProductStatus 
} = require('../controllers/productController');

router.get('/approved', getApprovedProducts);
router.get('/pending', getPendingProducts);
router.patch('/:id/status', updateProductStatus);

// Notice the upload.single('image') middleware added here
router.post('/', upload.single('image'), createProduct);

module.exports = router;