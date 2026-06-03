const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A post title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    // CHANGED: Now expects an array of strings instead of a single string
    images: {
      type: [String],
      default: [], 
    },
    author: {
      type: String,
      default: 'Admin Team', 
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;