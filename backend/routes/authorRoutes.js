// authorRoutes.js

const express = require('express');
const authorRouter = express.Router();
const { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require('../models/authors')

// GET all authors
authorRouter.get('/', getAuthors);

// GET author by ID
authorRouter.get('/:author_id', getAuthorById);

// POST create new author
authorRouter.post('/add', createAuthor);

// PUT update author by ID
authorRouter.put('/edit/:author_id', updateAuthor);

// DELETE author by ID
authorRouter.delete('/delete/:author_id', deleteAuthor);

module.exports = authorRouter;
