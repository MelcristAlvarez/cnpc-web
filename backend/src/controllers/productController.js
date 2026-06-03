const Product = require('../models/Product');

const getApprovedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending products', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, sellerName } = req.body;
    
    // Grab the Cloudinary URL if a file was uploaded
    const image = req.file ? req.file.path : null; 
    
    const newProduct = new Product({
      title,
      description,
      price,
      image,
      category,
      sellerName,
      status: 'pending'
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit product', error: error.message });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update status', error: error.message });
  }
};

module.exports = {
  getApprovedProducts,
  getPendingProducts,
  createProduct,
  updateProductStatus
};