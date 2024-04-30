const express = require('express');
const userRoutes = require('./users')
const authorRoutes = require('../models/authors').default
const bookRoutes = require('./books')
const bookCopyRoutes = require('./copy')
const publisherRoutes = require('./publishers')
const router = express.Router();

router.use('/api/authors', authorRoutes.getAuthors);
// router.use('/api/authors/:author_id', authorRoutes.getAuthorById);


router.use('/api/users', userRoutes); //http://localhost:3001/api/users
// router.use('/api/authors', authorRoutes);
router.use('/api/books', bookRoutes);
router.use('/api/book-copies', bookCopyRoutes);
router.use('/api/publishers', publisherRoutes);


module.exports = router;