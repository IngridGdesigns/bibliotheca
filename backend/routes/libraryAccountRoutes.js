const { 
    getAllAccounts,
    getUserAccountById, 
    createNewLibraryAccount, 
    getUserLibraryAccountWithFines, 
    getNewLibraryCard, 
    updateLibraryAccount, 
    deleteLibraryAccountById 
} = require('../models/libraryAccount');

const express = require('express');
const router = express.Router();

// GET all user accounts
router.get('/', getAllAccounts);

// GET user account by ID
router.get('/:user_id', getUserAccountById);

// GET user library account with fines
router.get('/user/:user_id', getUserLibraryAccountWithFines);

// GET new library card
router.get('/new-card', getNewLibraryCard);

// POST create a new library account
router.post('/create', createNewLibraryAccount);

// PUT update library account by ID
router.put('/update/:account_id', updateLibraryAccount);

// DELETE library account by ID (admin only)
router.delete('/delete/:account_id', deleteLibraryAccountById);

module.exports = router;
