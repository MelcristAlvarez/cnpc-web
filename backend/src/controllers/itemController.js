const Item = require('../models/Item');

// 1. PUBLIC: Get only approved items for the storefront
const getApprovedItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};

// 2. ADMIN: Get only pending items for the approval dashboard
const getPendingItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'pending' }).sort({ createdAt: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending items', error: error.message });
  }
};

// 3. PROTECTED: User submits a new item (defaults to 'pending')
const createItem = async (req, res) => {
  try {
    // We added 'category' here to pull it from the frontend form!
    const { title, category, description, price, sellerName, contactInfo } = req.body;
    
    // We use upload.single('image') so req.file contains our Cloudinary data
    if (!req.file) {
      return res.status(400).json({ message: 'An image is required to list an item.' });
    }

    const newItem = new Item({
      title,
      category, // Saved securely to the database
      description,
      price,
      sellerName,
      contactInfo,
      image: req.file.path 
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit item', error: error.message });
  }
};

// 4. ADMIN: Approve an item (Changes status to 'approved')
const approveItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve item', error: error.message });
  }
};

// 5. ADMIN: Reject/Delete an item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

module.exports = { getApprovedItems, getPendingItems, createItem, approveItem, deleteItem };