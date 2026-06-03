const mongoose = require('mongoose');

const aboutImageSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutImage', aboutImageSchema);