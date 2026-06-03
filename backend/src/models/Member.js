const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: 'Daet, Bicol, PH',
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    default: 'M',
  },
  role: {
    type: String,
    // THE FIX: Removed 'Member' and 'Officer', left only these two
    enum: ['Director', 'Organizer'], 
    default: 'Organizer',
  },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);