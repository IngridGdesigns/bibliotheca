const express = require('express');
const pool = require('../database')
const router = express.Router();

router.post('/adminlogin', (req, res) => {
    const client = pool.connect();
    const sql = `SELECT * FROM library_staff WHERE email = $1 AND password = $2`;
    client.query(sql, [req.body.email, req.body.password])
})