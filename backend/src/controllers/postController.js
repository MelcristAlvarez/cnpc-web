const Post = require('../models/Post');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;
    
    // Grab all uploaded file URLs from Cloudinary
    const images = req.files ? req.files.map(file => file.path) : [];
    
    const newPost = new Post({ title, content, isPinned, images });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content, isPinned, existingImages } = req.body;
    
    // 1. Safely parse the existing images we kept from the frontend edit
    let images = [];
    if (existingImages) {
      try {
        images = JSON.parse(existingImages);
      } catch (e) {
        images = []; // Fallback in case of parsing error
      }
    }
    
    // 2. Add any brand new images uploaded during this specific edit
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      images = [...images, ...newImages];
    }

    // 3. Save to database
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, 
      { title, content, isPinned, images }, 
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) { 
    console.error("Update Post Error:", error);
    res.status(500).json({ error: error.message }); 
  }
};

const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

module.exports = { getPosts, createPost, updatePost, deletePost };