const express = require('express');
const pool = require('../database');
const api = express.api();

/*************************************
        library_account table CRUD 
*************************************/

// get account info by account_id and joining fines table
api.get('/:account_id', async (req, res) => {
    const accountId = req.params.account_id;
    try {
        const client = await pool.connect();
        const queryText = `SELECT la.*, SUM(f.amount) AS total_fines
            FROM library_account la
            LEFT JOIN fine f ON la.member_id = f.member_id
            WHERE la.account_id = $1
            GROUP BY la.account_id`;
        const { rows } = await client.query(queryText, [accountId]);
        if (rows.length === 0) {
            res.status(404).send('Library account not found');
        } else {
            res.status(200).json(rows[0]);
        }
        client.release();
    } catch (error) {
        console.error('Error fetching library account:', error);
        res.status(500).send('Server error');
    }
});

// CREATE operation
api.post('/', async (req, res) => {
    const { member_id, card_number } = req.body;
    try {
        const client = await pool.connect();
        const queryText = 'INSERT INTO library_account (member_id, card_number) VALUES ($1, $2) RETURNING *';
        const { rows } = await client.query(queryText, [member_id, card_number]);
        res.status(201).json(rows[0]);
        client.release();
    } catch (error) {
        console.error('Error creating library account:', error);
        res.status(500).send('Server error');
    }
});

// UPDATE operation
api.put('/:account_id', async (req, res) => {
    const accountId = req.params.account_id;
    const { card_number } = req.body;
    try {
        const client = await pool.connect();
        const queryText = 'UPDATE library_account SET card_number = $1 WHERE account_id = $2 RETURNING *';
        const { rows } = await client.query(queryText, [card_number, accountId]);
        if (rows.length === 0) {
            res.status(404).send('Library account not found');
        } else {
            res.status(200).json(rows[0]);
        }
        client.release();
    } catch (error) {
        console.error('Error updating library account:', error);
        res.status(500).send('Server error');
    }
});

// DELETE operation
api.delete('/:account_id', async (req, res) => {
    const accountId = req.params.account_id;
    try {
        const client = await pool.connect();
        const queryText = 'DELETE FROM library_account WHERE account_id = $1';
        await client.query(queryText, [accountId]);
        res.status(204).end();
        client.release();
    } catch (error) {
        console.error('Error deleting library account:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
