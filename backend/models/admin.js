const express = require('express');
const pool = require('../database');
const { AdminMessagesPermissions } = require('../messages/messages-permissions');
const router = express.Router();

router.post('/adminlogin', AdminMessagesPermissions, (req, res) => {
    const client = pool.connect();
    const sql = `SELECT * FROM library_staff WHERE email = $1 AND password = $2`;
    client.query(sql, [req.body.email, req.body.password])
})

// if (role == admin{
//     const admin = await AdminMessagesPermissions.admin
// })