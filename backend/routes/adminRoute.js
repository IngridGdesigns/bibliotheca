const express = require('express');
const pool = require('../database')

const adminRouter = express.Router();

adminRouter.post('/admin', (req, res) => {
    const client = pool.connect();
    client.query = 'SELECT * from library_staff WHERE email = $1 and password = $2',
    console.log(req.body);
})

module.exports = adminRouter;