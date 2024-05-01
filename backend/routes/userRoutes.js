const { getUsers, getUserById, createUser, updateUserById, deleteUser } = require('../models/users');

/* ********************************************************************** 

    Created file need to tweak later - need to pull data from Auth0 to keep track of users

****************************************************************************** */

const express = require('express');
const router = express.Router();

// GET all users
router.get('/', getUsers);

// GET user by ID
router.get('/:user_id', getUserById);

// POST create a new user
router.post('/create', createUser);

// PUT update user by ID
router.put('/update/:user_id', updateUserById);

// DELETE user by ID
router.delete('/delete/:user_id', deleteUser);

module.exports = router;
