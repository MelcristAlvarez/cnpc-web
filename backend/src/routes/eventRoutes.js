const express = require('express');
const router = express.Router();
const { getEvents, getAllEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/all', getAllEvents); // The Admin endpoint
router.post('/', createEvent);
router.put('/:id', updateEvent); // Edit endpoint
router.delete('/:id', deleteEvent); // Delete endpoint

module.exports = router;