const Item = require('../models/Item');

// 1. PUBLIC: Get only approved items
const getApprovedItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};

// 2. ADMIN: Get pending items
const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'pending' }).sort({ createdAt: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending items', error: error.message });
  }
};

// NEW: ADMIN: Get ALL items for the marketplace
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({}).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all items', error: error.message });
  }
};

// NEW: PROTECTED: Get items belonging to the logged-in user
const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ sellerName: req.user.fullName }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your items', error: error.message });
  }
};

// 3. PROTECTED: User submits a new item
const createItem = async (req, res) => {
  try {
    const { title, category, description, price, sellerName, contactInfo } = req.body;
    if (!req.file) return res.status(400).json({ message: 'An image is required.' });

    const newItem = new Item({
      title, category, description, price, sellerName, contactInfo,
      image: req.file.path,
      status: 'pending'
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit item', error: error.message });
  }
};

// 4. ADMIN: Approve an item
const approveItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve item', error: error.message });
  }
};

// 5. PROTECTED (Admin OR Seller): Delete an item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Ensure the person deleting is either an admin OR the original seller
    if (req.user.role !== 'admin' && item.sellerName !== req.user.fullName) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

module.exports = { getApprovedItems, getPendingItems, getAllItems, getUserItems, createItem, approveItem, deleteItem };