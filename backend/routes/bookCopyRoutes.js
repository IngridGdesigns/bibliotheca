const {
    getBookCopies,
    getBookCopiesById,
    createBookCopy,
    editCopyById,
    deleteByCopyId
} = require('../models/copy');
const express = require('express');
const router = express.Router();

// GET all book copies
router.get('/', getBookCopies);

// GET book copy by ID
router.get('/:copy_id', getBookCopiesById);

// POST create new book copy
router.post('/add', createBookCopy);

// PUT edit book copy by ID
router.put('/edit/:copy_id', editCopyById);

// DELETE book copy by ID
router.delete('/delete/:copy_id', deleteByCopyId);

module.exports = router;
