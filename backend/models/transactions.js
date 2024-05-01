const pool = require('../database'); // Import your PostgreSQL connection pool


/*********************************************
        
    Transactions table CRUD 

**********************************************/

// Read all transactions with associated book and user information
const getTransactions = async (req, res) => {
    try {
        const client = await pool.connect();
        const queryText = `
            SELECT t.*, b.title AS book_title, u.name AS user_name
            FROM transaction t
            INNER JOIN book b ON t.copy_id = b.book_id
            INNER JOIN users u ON t.member_id = u.member_id
        `;
        const { rows } = await client.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).send('Server error');
    }
};

// Create new transaction
const createTransaction = async (req, res) => {
    const { member_id, copy_id, transaction_type, due_date, issued_by, fine_id } = req.body;

    try {
        const client = await pool.connect();
        const queryText = 'INSERT INTO transaction (member_id, copy_id, transaction_type, due_date, issued_by, fine_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [member_id, copy_id, transaction_type, due_date, issued_by, fine_id];
        const { rows } = await client.query(queryText, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).send('Server error');
    }
};

// update transaction by ID
const updateTransaction = async (req, res) => {
    const transactionId = req.params.transaction_id;
    const { member_id, copy_id, transaction_type, due_date, issued_by, fine_id } = req.body;

    try {
        const client = await pool.connect();
        const queryText = `
            UPDATE transaction
            SET member_id = $1, copy_id = $2, transaction_type = $3, due_date = $4, issued_by = $5, fine_id = $6
            WHERE transaction_id = $7
            RETURNING *;
        `;
        const values = [member_id, copy_id, transaction_type, due_date, issued_by, fine_id, transactionId];
        const { rows } = await client.query(queryText, values);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).send('Server error');
    }
};

// // Delete transaction
// const delete('/transaction/delete/:transaction_id', async (req, res) => {
//     const transactionId = req.params.transaction_id;

//     try {
//         const client = await pool.connect();
//         await client.query('DELETE FROM transaction WHERE transaction_id = $1', [transactionId]);
//         res.status(204).send();
//     } catch (error) {
//         console.error('Error deleting transaction:', error);
//         res.status(500).send('Server error');
//     }
// });

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction
}