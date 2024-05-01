
const { 
    getFines, 
    // getFinesByMemberId, 
    // userPayFine, 
    // createDamagedOrLostFee, 
    // updateFine, 
    // deleteFine 
} = require('../models/fines');
const express = require('express');
const router = express.Router();

// GET all fines
router.get('/', getFines);

//// GET fines by id
// router.get('/:member_id', getFinesByMemberId);

// // POST user pay fine
// router.put('/pay', userPayFine);

// // POST create new damaged/lost fee
// router.post('/create', createDamagedOrLostFee);

// // PUT update by id
// router.put('/edit/:fine_id', updateFine);

// // DELETE by id
// router.delete('/delete/:fine_id', deleteFine);

module.exports = router;
