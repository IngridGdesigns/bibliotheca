const express = require('express');

const authorRoutes = require('./authorRoutes')
const bookRoutes = require('./bookRoutes')
const bookCopyRoutes = require('./copyRoutes')
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

// router.use('/api/authors', authorRoutes.getAuthors);
// // router.use('/api/authors/:author_id', authorRoutes.getAuthorById);

router.use('/api/authors', authorRoutes);
router.use('/api/books', bookRoutes);
router.use('/api/book-copies', bookCopyRoutes);
router.use('/api/category', categoryRoutes);
router.use('/api/fines', fineRoutes);
router.use('/api/holds', holdRoutes);
router.use('/api/library_account', libraryAccountRoutes);
router.use('./api/staff', libraryStaff);
router.use('/api/publishers', publisherRoutes);
router.use('./api/reports', reportRoutes)
router.use('./api/transactions', Routes)
router.use('/api/users', userRoutes); //http://localhost:3001/api/users
router.use('./api/',  )
module.exports = router;