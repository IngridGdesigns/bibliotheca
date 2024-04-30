const {
    getBookCopies,
    getBookCopiesById,
    createBookCopy,
    editCopyById,
    deleteByCopyId
} = require('../models/bookCopies');

// GET all book copies
bookCopyRouter.get('/', getBookCopies);

// GET book copy by ID
bookCopyRouter.get('/:copy_id', getBookCopiesById);

// POST create new book copy
bookCopyRouter.post('/add', createBookCopy);

// PUT edit book copy by ID
bookCopyRouter.put('/edit/:copy_id', editCopyById);

// DELETE book copy by ID
bookCopyRouter.delete('/delete/:copy_id', deleteByCopyId);

module.exports = bookCopyRouter;
