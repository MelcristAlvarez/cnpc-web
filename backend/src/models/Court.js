const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    gmapsUrl: { type: String, default: '' },
    images: [{ type: String }], // Array of image URLs!
    submitterName: { type: String, default: 'Admin' },
    status: { 
      type: String, 
      enum: ['pending', 'approved'], 
      default: 'pending' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Court', courtSchema);