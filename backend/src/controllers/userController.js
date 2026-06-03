const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    // 1. Prepare the data to update
    const updateData = {
      fullName: req.body.name,
      location: req.body.location,
      birthDate: req.body.birthDate,
      gender: req.body.gender,
      clubId: req.body.clubId,
    };

    // 2. If an image was uploaded, add the Cloudinary URL to the update list!
    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    // 3. Update the database
    await User.updateOne(
      { _id: req.user.id },
      { $set: updateData }
    );
    
    const updatedUser = await User.findById(req.user.id).select('-password');
    
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("CRITICAL ERROR UPDATING PROFILE:", error);
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };