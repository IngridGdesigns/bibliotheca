const { 
    getAllHolds,
    getBookDetailsofAllHolds,
    getHoldDetails,
    getReservedBook,
    createBookOnHold,
    deleteHold,
    getAllBooksaAndMemberPlacingHolds
} = require('../models/holds');
const express = require('express');
const router = express.Router();

// GET all holds
router.get('/', getAllHolds);

// // GET reserved book
router.get('/reserved/:book_id', getReservedBook);

// // GET hold details
router.get('/:hold_id', getHoldDetails);

// Get book detials
router.get('./book-details', getBookDetailsofAllHolds)

router.get('./member-holds', getAllBooksaAndMemberPlacingHolds)

// POST create book on hold
router.post('/create', createBookOnHold);

// DELETE hold by ID
router.delete('/delete/:hold_id', deleteHold);

// GET all books and members placing holds
// router.get('/allbooks', getAllBooksAndMemberPlacingHolds);

module.exports = router;
