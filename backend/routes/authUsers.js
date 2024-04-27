// var axios = require("axios").default;

// var options = {
//   method: 'GET',
//   url: 'https://icodenow.auth0.com/api/v2/users',
//   params: {q: 'email:"jane@exampleco.com"', search_engine: 'v3'},
//   headers: {authorization: 'Bearer {yourMgmtApiAccessToken}'}
// };

// axios.request(options).then(function (response) {
//   console.log(response.data);
// }).catch(function (error) {
//   console.error(error);
// });



// const express = require('express');
// require('dotenv').config({ debug: true }) //to use process.env
// const { ManagementClient } = require('auth0');

// const router = express.Router();

// const { AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE, AUTH0_DOMAIN } = process.env

// const management = new ManagementClient({
//   domain: AUTH0_DOMAIN, 
//   clientId: AUTH0_CLIENT_ID,
//   clientSecret: AUTH0_CLIENT_SECRET,
// });

// // Get all users
// router.get('/users', async (req, res) => {
//   try {
//     const users = await management.getUsers();
//     res.json(users);
//   } catch (error) {
//     console.error('Error getting users:', error);
//     res.status(500).json({ error: 'Failed to get users.' });
//   }
// });

// // Get user by ID
// router.get('/users/:userId', async (req, res) => {
//   try {
//     const user = await management.getUser({ id: req.params.userId });
//     res.json(user);
//   } catch (error) {
//     console.error('Error getting user:', error);
//     res.status(500).json({ error: 'Failed to get user.' });
//   }
// });

// // Create a new user
// router.post('/users', async (req, res) => {
//   try {
//     const newUser = await management.createUser(req.body);
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ error: 'Failed to create user.' });
//   }
// });

// // Update user by ID
// router.put('/users/:userId', async (req, res) => {
//   try {
//     const updatedUser = await management.updateUser({ id: req.params.userId }, req.body);
//     res.json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ error: 'Failed to update user.' });
//   }
// });

// // Delete user by ID
// router.delete('/users/:userId/multifactor/:provider', async (req, res) => {
//   try {
//     await management.deleteUser({ id: req.params.userId });
//     res.sendStatus(204);
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ error: 'Failed to delete user.' });
//   }
// });

// module.exports = router;
