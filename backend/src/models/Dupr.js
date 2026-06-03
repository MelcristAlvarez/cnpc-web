const mongoose = require('mongoose');

const duprSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Mens Doubles', 'Womens Doubles'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dupr', duprSchema);