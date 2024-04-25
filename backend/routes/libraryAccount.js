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

// Read all library accounts with associated fines, holds, and transactions
api.get('/library-account', async (req, res) => {
    try {
        const client = await pool.connect();
        const queryText = `
            SELECT la.*, SUM(f.amount) AS total_fines, COUNT(h.hold_id) AS num_holds, COUNT(t.transaction_id) AS num_transactions
            FROM library_account la
            LEFT JOIN fine f ON la.member_id = f.member_id
            LEFT JOIN holds h ON la.member_id = h.member_id
            LEFT JOIN transaction t ON la.member_id = t.member_id
            GROUP BY la.account_id;
        `;
        const { rows } = await client.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching library accounts:', error);
        res.status(500).send('Server error');
    }
});

// CREATE operation
// create new library account
api.post('/library-account/add', async (req, res) => {
    const { member_id, card_number, reserve_book, return_book, renew_book, num_checked_out_books, fines_to_pay, make_payment } = req.body;

    try {
        const client = await pool.connect();
        const queryText = `
        INSERT INTO library_account (member_id, card_number,
            reserve_book, return_book, renew_book, num_checked_out_books,
            fines_to_pay, make_payment)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const values = [member_id, card_number, reserve_book, return_book, renew_book, num_checked_out_books, fines_to_pay, make_payment];
        const { rows } = await client.query(queryText, values);
        res.status(201).json(rows[0]);
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

// Update library account
api.put('/:account_id', async (req, res) => {
    const account_id = req.params.account_id;
    const { member_id, card_number, reserve_book, return_book, renew_book, num_checked_out_books, fines_to_pay, make_payment } = req.body;

    try {
        const client = await pool.connect();
        const queryText = 'UPDATE library_account SET member_id = $1, card_number = $2, reserve_book = $3, return_book = $4, renew_book = $5, num_checked_out_books = $6, fines_to_pay = $7, make_payment = $8 WHERE account_id = $9 RETURNING *';
        const values = [member_id, card_number, reserve_book, return_book, renew_book, num_checked_out_books, fines_to_pay, make_payment, account_id];
        const { rows } = await client.query(queryText, values);
        res.status(200).json(rows[0]);
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
