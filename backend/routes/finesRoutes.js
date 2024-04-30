const { 
    getFines, 
    getFinesByMemberId, 
    userPayFine, 
    createDamagedOrLostFee, 
    updateFine, 
    deleteFine 
} = require('../models/fines');

// GET all fines
fineRouter.get('/', getFines);

// GET fines by id
fineRouter.get('/member/:member_id', getFinesByMemberId);

// POST user pay fine
fineRouter.post('/pay', userPayFine);

// POST create new damaged/lost fee
fineRouter.post('/create', createDamagedOrLostFee);

// PUT update by id
fineRouter.put('/edit/:fine_id', updateFine);

// DELETE by id
fineRouter.delete('/delete/:fine_id', deleteFine);

module.exports = fineRouter;
