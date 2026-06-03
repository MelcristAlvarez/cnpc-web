const Coach = require('../models/Coach');

const getApprovedCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(coaches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coaches', error: error.message });
  }
};

const getPendingCoaches = async (req, res) => {
  try {
    const applications = await Coach.find({ status: 'pending' }).sort({ createdAt: 1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
};

const createCoachApp = async (req, res) => {
  try {
    // Extracted the new specific email/facebook/phone fields
    const { name, tagline, certs, achievements, email, facebook, phone } = req.body;
    if (!req.file) return res.status(400).json({ message: 'A profile photo is required.' });

    const newCoach = new Coach({
      name, tagline, certs, achievements, email, facebook, phone, image: req.file.path
    });

    const savedCoach = await newCoach.save();
    res.status(201).json(savedCoach);
  } catch (error) {
    res.status(400).json({ message: 'Failed to submit application', error: error.message });
  }
};

const approveCoach = async (req, res) => {
  try {
    const updatedCoach = await Coach.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    res.status(200).json(updatedCoach);
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve application', error: error.message });
  }
};

const updateCoach = async (req, res) => {
  try {
    const { name, tagline, certs, achievements, email, facebook, phone } = req.body;
    const updateData = { name, tagline, certs, achievements, email, facebook, phone };

    if (req.file) updateData.image = req.file.path; 

    const updatedCoach = await Coach.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedCoach);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update coach', error: error.message });
  }
};

const deleteCoach = async (req, res) => {
  try {
    await Coach.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete application', error: error.message });
  }
};

module.exports = { 
  getApprovedCoaches, getPendingCoaches, createCoachApp, approveCoach, updateCoach, deleteCoach 
};