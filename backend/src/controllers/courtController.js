const Court = require('../models/Court');

const getApprovedCourts = async (req, res) => {
  try {
    const courts = await Court.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(courts);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPendingCourts = async (req, res) => {
  try {
    const courts = await Court.find({ status: 'pending' }).sort({ createdAt: 1 });
    res.status(200).json(courts);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createCourt = async (req, res) => {
  try {
    const { name, area, address, gmapsUrl, submitterName } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];
    
    if (images.length === 0) return res.status(400).json({ message: 'At least one photo is required.' });

    const newCourt = new Court({ name, area, address, gmapsUrl, submitterName, images });
    const savedCourt = await newCourt.save();
    res.status(201).json(savedCourt);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const approveCourt = async (req, res) => {
  try {
    const updatedCourt = await Court.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.status(200).json(updatedCourt);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateCourt = async (req, res) => {
  try {
    const { name, area, address, gmapsUrl, existingImages } = req.body;
    
    // Parse the existing images that the admin decided to keep
    let images = existingImages ? JSON.parse(existingImages) : [];
    
    // Add any brand new images uploaded during the edit
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      images = [...images, ...newImages];
    }

    const updatedCourt = await Court.findByIdAndUpdate(
      req.params.id, 
      { name, area, address, gmapsUrl, images }, 
      { new: true }
    );
    res.status(200).json(updatedCourt);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const deleteCourt = async (req, res) => {
  try {
    await Court.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Court deleted successfully' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getApprovedCourts, getPendingCourts, createCourt, approveCourt, updateCourt, deleteCourt };