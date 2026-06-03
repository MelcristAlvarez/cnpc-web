const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    
    // FIX: These are now completely optional so MongoDB stops throwing 400 errors!
    certs: { type: String, default: '' },
    achievements: { type: String, default: '' },
    
    email: { type: String, default: '' },
    facebook: { type: String, default: '' },
    phone: { type: String, default: '' },
    image: { type: String, required: true }, 
    status: { 
      type: String, 
      enum: ['pending', 'approved'], 
      default: 'pending' 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coach', coachSchema);