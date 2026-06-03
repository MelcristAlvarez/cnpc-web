const Dupr = require('../models/Dupr');

// 1. READ (Public) - Get all players, automatically sorted by rating (Highest to Lowest)
const getStandings = async (req, res) => {
  try {
    const standings = await Dupr.find().sort({ rating: -1 });
    res.status(200).json(standings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. CREATE (Admin) - Add a new player
const addPlayer = async (req, res) => {
  try {
    const { name, rating, category } = req.body;
    const newPlayer = new Dupr({ name, rating, category });
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add player', error: error.message });
  }
};

// 3. UPDATE (Admin) - Change a player's rating
const updatePlayer = async (req, res) => {
  try {
    const updatedPlayer = await Dupr.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update player', error: error.message });
  }
};

// 4. DELETE (Admin) - Remove a player
const deletePlayer = async (req, res) => {
  try {
    await Dupr.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Player removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete player', error: error.message });
  }
};

module.exports = { getStandings, addPlayer, updatePlayer, deletePlayer };