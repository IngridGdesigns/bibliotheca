const express = require('express');
const pool = require('../database')

const adminRouter = express.Router();

adminRouter.post('/adminLogin', (req, res) => {
    const client = pool.connect();
    client.query = 'SELECT * from library_staff WHERE email = $1 and password = $2',
    console.log(req.body);
})

// adminRouter.get('/api/messages/admin', (req, res) => {

// })

module.exports = adminRouter;

//https://stackoverflow.com/questions/61240342/react-how-to-structure-routes-for-admin-user-and-public