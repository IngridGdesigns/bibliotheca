const express = require('express');
const userRoutes = require('./users')
const authorRoutes = require('./authors')
const bookRoutes = require('./books')
const bookCopyRoutes = require('./copy')
const publisherRoutes = require('./publishers')
const router = express.Router();

router.use('/api/users', userRoutes); //http://localhost:3001/api/users
router.use('/api/authors', authorRoutes);
router.use('/api/books', bookRoutes);
router.use('/api/book-copies', bookCopyRoutes);
router.use('/api/publishers', publisherRoutes);


module.exports = router;