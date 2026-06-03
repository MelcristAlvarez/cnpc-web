const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '' },
    duprRating: { type: Number, default: 0.0 },
    role: { type: String, enum: ['member', 'admin'], default: 'member' },
    clubId: { type: String, default: '' },
    location: { type: String, default: '' },
    birthDate: { type: String, default: '' },
    gender: { type: String, default: '' }
  },
  { timestamps: true }
);

// Adding 'cnpc_members' forces MongoDB to create a clean table, bypassing old Clerk errors!
module.exports = mongoose.model('User', userSchema, 'cnpc_members');