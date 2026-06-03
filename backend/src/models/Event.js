const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'An event title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['Open Play', 'Tournament', 'Training'], 
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    attendeesCount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;