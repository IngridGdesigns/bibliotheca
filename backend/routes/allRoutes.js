const express = require('express');

// const adminRoute = require('./adminRoute');
const authorRoutes = require('./authorRoutes')
const bookRoutes = require('./bookRoutes')
const bookCopyRoutes = require('./bookCopyRoutes')
const categoryRoutes = require('./categoryRoutes')
const fineRoutes = require('./finesRoutes')
const holdRoutes = require('./holdsRoutes')
const libraryAccountRoutes = require('./libraryAccountRoutes')
const libraryStaff = require('./libraryStaffRoutes')
const publisherRoutes = require('./publisherRoutes')
const reportRoutes = require('./reportRoutes')
const transactionRoutes = require('./transactionsRoutes')
const userRoutes = require('./userRoutes')

const router = express.Router();

router.use('/authors', authorRoutes);
router.use('/books', bookRoutes);
router.use('/book-copies', bookCopyRoutes);
router.use('/category', categoryRoutes);
router.use('/fines', fineRoutes);
router.use('/holds', holdRoutes);
router.use('/library_account', libraryAccountRoutes);
router.use('/staff', libraryStaff);
router.use('/publishers', publisherRoutes);
router.use('/reports', reportRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes); //http://localhost:3001/api/users
// router.use('/admin', adminRoutes);

module.exports = router;


// router.use('/api/authors', authorRoutes.getAuthors);
// // router.use('/api/authors/:author_id', authorRoutes.getAuthorById);