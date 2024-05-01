const express = require('express');
const router = express.Router();
const { getAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor } = require('../models/authors')

// GET all authors
router.get('/', getAuthors);

// GET author by ID
router.get('/:author_id', getAuthorById);

// POST create new author
router.post('/add', createAuthor);

// PUT update author by ID
router.put('/edit/:author_id', updateAuthor);

// DELETE author by ID
router.delete('/delete/:author_id', deleteAuthor);

module.exports = router;
