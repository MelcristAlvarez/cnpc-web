const mongoose = require('mongoose');

const coachApplicationSchema = new mongoose.Schema(
  {
    applicantName: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'A specialty tagline is required'],
      trim: true,
    },
    certifications: {
      type: String, 
      default: '',
    },
    achievements: {
      type: String, 
      required: [true, 'Key achievements are required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending', 
    }
  },
  {
    timestamps: true,
  }
);

const CoachApplication = mongoose.model('CoachApplication', coachApplicationSchema);
module.exports = CoachApplication;