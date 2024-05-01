const { 
    getUserAccountById, 
    createNewLibraryAccount, 
    getUserLibraryAccountWithFines, 
    getNewLibraryCard, 
    updateLibraryAccount, 
    deleteLibraryAccountById 
} = require('../models/libraryAccounts');

const express = require('express');
const libraryAccountRouter = express.Router();

// GET user account by ID
libraryAccountRouter.get('/:user_id', getUserAccountById);

// GET user library account with fines
libraryAccountRouter.get('/withFines/:user_id', getUserLibraryAccountWithFines);

// GET new library card
libraryAccountRouter.get('/newCard', getNewLibraryCard);

// POST create a new library account
libraryAccountRouter.post('/create', createNewLibraryAccount);

// PUT update library account by ID
libraryAccountRouter.put('/update/:account_id', updateLibraryAccount);

// DELETE library account by ID (admin only)
libraryAccountRouter.delete('/delete/:account_id', deleteLibraryAccountById);

module.exports = libraryAccountRouter;
