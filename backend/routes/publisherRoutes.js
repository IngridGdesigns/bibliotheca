const { getAllPublishers, getPublisherById, addPublisher, updatePublisher } = require('../models/publishers');
const express = require('express');

const publisherRouter = express.Router();

// GET all publishers
publisherRouter.get('/', getAllPublishers);

// GET publisher by ID
publisherRouter.get('/:publisher_id', getPublisherById);

// POST add a new publisher
publisherRouter.post('/add', addPublisher);

// PUT update publisher by ID
publisherRouter.put('/update/:publisher_id', updatePublisher);

module.exports = publisherRouter;
