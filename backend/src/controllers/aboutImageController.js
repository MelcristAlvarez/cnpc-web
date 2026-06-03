const AboutImage = require('../models/AboutImage');

const getAboutImages = async (req, res) => {
  try {
    const images = await AboutImage.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const addAboutImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'An image file is required.' });
    const newImage = new AboutImage({ image: req.file.path });
    const saved = await newImage.save();
    res.status(201).json(saved);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const deleteAboutImage = async (req, res) => {
  try {
    await AboutImage.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getAboutImages, addAboutImage, deleteAboutImage };