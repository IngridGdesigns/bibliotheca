const express = require('express');
const pool = require('../database'); // Import your PostgreSQL connection pool

let api = express.Router();

// Get a list of fines for a specific user.
// Pay a fine.
// Get details of a specific fine.
// Update fine details (if necessary).

/********************************
        Fines table CRUD 
********************************/

// Read all fines with associated member information 
api.get('/fine', async (req, res) => {
    try {
        const client = await pool.connect();
        const queryText = `SELECT * FROM fine WHERE member_id = $1;`
        // const queryText = `
        //     SELECT f.*, u.name AS member_name
        //     FROM fine f
        //     INNER JOIN users u ON f.member_id = u.member_id
        // `;
        const { rows } = await client.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching fines:', error);
        res.status(500).send('Server error');
    }
});

// Create new fine
api.post('/add', async (req, res) => {
    const { amount, reason, member_id, transaction_id } = req.body;

    try {
        const client = await pool.connect();
        const queryText = 'INSERT INTO fine (amount, reason, member_id, transaction_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [amount, reason, member_id, transaction_id];
        const { rows } = await client.query(queryText, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating fine:', error);
        res.status(500).send('Server error');
    }
});

// Update fine
api.put('/:fine_id', async (req, res) => {
    const fine_id = req.params.fine_id;
    const { amount, reason, member_id, transaction_id } = req.body;

    try {
        const client = await pool.connect();
        const queryText = 'UPDATE fine SET amount = $1, reason = $2, member_id = $3, transaction_id = $4 WHERE fine_id = $5 RETURNING *';
        const values = [amount, reason, member_id, transaction_id, fine_id];
        const { rows } = await client.query(queryText, values);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error updating fine:', error);
        res.status(500).send('Server error');
    }
});

// delete fine
api.delete('/:fine_id', async (req, res) => {
    const fine_id = req.params.fine_id;

    try {
        const client = await pool.connect();
        await client.query('DELETE FROM fine WHERE fine_id = $1', [fine_id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting fine:', error);
        res.status(500).send('Server error');
    }
});