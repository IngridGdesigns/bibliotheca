const { getAllPublishers, getPublisherById, addPublisher, updatePublisher } = require('../models/publishers');
const express = require('express');
const router = express.Router();

// GET all publishers
router.get('/', getAllPublishers);

// GET publisher by ID
router.get('/:publisher_id', getPublisherById);

// POST add a new publisher
router.post('/add', addPublisher);

// PUT update publisher by ID
router.put('/update/:publisher_id', updatePublisher);

module.exports = router;
