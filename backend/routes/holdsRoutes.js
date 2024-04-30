const { 
    getAllHolds, 
    getReservedBook, 
    getHoldDetails, 
    createBookOnHold, 
    deleteHold, 
    getAllBooksAndMemberPlacingHolds 
} = require('../models/holds');

// GET all holds
holdRouter.get('/', getAllHolds);

// GET reserved book
holdRouter.get('/reserved/:book_id', getReservedBook);

// GET hold details
holdRouter.get('/:hold_id', getHoldDetails);

// POST create book on hold
holdRouter.post('/create', createBookOnHold);

// DELETE hold by ID
holdRouter.delete('/delete/:hold_id', deleteHold);

// GET all books and members placing holds
holdRouter.get('/allBooksAndMembersPlacingHolds', getAllBooksAndMemberPlacingHolds);

module.exports = holdRouter;
