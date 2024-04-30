const {
    getBooks,
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

// GET all books
bookRouter.get('/', getBooks);

// GET book by ID
bookRouter.get('/:book_id', getBookById);

// GET book by author name
bookRouter.get('/author/:author_name', getBookByAuthorName);

// GET book by publisher
bookRouter.get('/publisher/:publisher_name', getBookByPublisher);

// GET book by category
bookRouter.get('/category/:category_name', getBookByCategory);

// POST create new borrow book
bookRouter.post('/borrow', createBorrowBook);

// POST create new renew book
bookRouter.post('/renew', createRenewBook);

// POST create new return book
bookRouter.post('/return', createReturnBook);

// Admin routes
// POST create new book
bookRouter.post('/add', createBook);

// PUT update book by ID
bookRouter.put('/edit/:book_id', updateBook);

// DELETE book by ID
bookRouter.delete('/delete/:book_id', deleteBook);


module.exports = bookRouter;
