const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ['Paddle', 'Apparel', 'Accessories', 'Other'],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true, // We will use Cloudinary to upload and store this URL later
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links the product to the specific player who is selling it
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);