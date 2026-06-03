const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // ADDED CATEGORY
  description: { type: String, required: true },
  price: { type: String, required: true },
  sellerName: { type: String, required: true },
  contactInfo: { type: String, required: true },
  image: { type: String, required: true }, 
  status: { 
    type: String, 
    enum: ['pending', 'approved'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);