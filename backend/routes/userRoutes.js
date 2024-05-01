const {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUser
} = require('../models/users');

/*

    Created file need to tweak later -  I want to pull data from Auth0 to keep track of info

*/

const express = require('express');
const userRouter = express.Router();

// GET all users
userRouter.get('/', getUsers);

// GET user by ID
userRouter.get('/:user_id', getUserById);

// POST create a new user
userRouter.post('/create', createUser);

// PUT update user by ID
userRouter.put('/update/:user_id', updateUserById);

// DELETE user by ID
userRouter.delete('/delete/:user_id', deleteUser);

module.exports = userRouter;
