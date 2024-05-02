const { getUsers, getUserById, createUser, updateUserById, deleteUser } = require('../models/users');
const { AUTH0_AUDIENCE, AUTH0_DOMAIN} = process.env

/* ********************************************************************** 

    Created file need to tweak later - need to pull data from Auth0 to keep track of users

****************************************************************************** */
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer'); // AUTH0
// const apiRouter = express.Router();
const checkJwt = auth({
    audience: `${AUTH0_AUDIENCE}`,
    issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256'
});

const checkScopes = requiredScopes('read:messages, read:users, post:users, create:users');



const express = require('express');
const router = express.Router();

// GET all users
router.get('/', getUsers);

// GET user by ID
router.get('/:member_id', getUserById);

// POST create a new user
router.post('/', createUser);

// PUT update user by ID
router.put('/update/:member_id', updateUserById);

// DELETE user by ID
router.delete('/delete/:member_id', deleteUser);

module.exports = router;
