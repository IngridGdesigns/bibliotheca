const express = require('express');
const {
    getBooks,
    // getBooksWithAuthorCategoryPublisher,
    getBookById,
    getBookByAuthorName,
    getBookByPublisher,
    getBookByCategory,
    createBorrowBook,
    createRenewBook,
    createReturnBook,
    createBook, // Admin only 
    updateBook, // Admin only 
    deleteBook // Admin only 
} = require('../models/books');
const router = express.Router();

// GET all books
router.get('/', getBooks);

// GET all books to display in library
// router.get('/details', getBooksWithAuthorCategoryPublisher);

// GET book by ID
router.get('/:book_id', getBookById);

// GET book by author name
router.get('/author/:author_name', getBookByAuthorName);

// GET book by publisher
router.get('/publisher/:publisher_name', getBookByPublisher);

// GET book by category
router.get('/category/:category_name', getBookByCategory);

// POST create new borrow book
router.post('/borrow', createBorrowBook);

// POST create new renew book
router.post('/renew', createRenewBook);

// POST create new return book
router.post('/return', createReturnBook);

// Admin routes
// POST create new book
router.post('/add', createBook);

// PUT update book by ID
router.put('/edit/:book_id', updateBook);

// DELETE book by ID
router.delete('/delete/:book_id', deleteBook);


module.exports = router;
