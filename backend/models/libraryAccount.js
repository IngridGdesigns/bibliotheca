const pool = require('../database');

/*************************************
        library_account table CRUD 
*************************************/

// get account info by account_id and joining fines table
const getUserAccountById = async (req, res) => {
    const accountId = parseInt(req.params.account_id);
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
};

// Read all library accounts with associated fines, holds, and transactions - reports - 
const getUserLibraryAccountWithFines =  async (req, res) => {
    try {
        const client = await pool.connect();
        const queryText = `
          SELECT la.*,
            COALESCE(SUM(f.amount), 0) AS total_fines,
            COUNT(DISTINCT h.hold_id) AS num_holds,
            COUNT(DISTINCT CASE WHEN t.transaction_type = 'Fine' THEN t.transaction_id END) AS num_fine_transactions
        FROM
            library_account la
        LEFT JOIN
            fine f ON la.member_id = f.member_id
        LEFT JOIN
            holds h ON la.member_id = h.member_id
        LEFT JOIN
            transaction t ON la.member_id = t.member_id AND t.transaction_type = 'Fine'
        GROUP BY
            la.account_id;
        `;
        const { rows } = await client.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching library accounts:', error);
        res.status(500).send('Server error');
    }
};


// CREATE operation
// create new library account
const createNewLibraryAccount =  async (req, res) => {
    const member_id = parseInt(req.body.member_id);

    try {
        const client = await pool.connect();
        const queryText = `
        INSERT INTO library_account (member_id, card_number)
        VALUES ($1, $2) RETURNING *`;

        const card_number = parseInt(faker.string.uuid()); 
        const values = [member_id, card_number];
        const { rows } = await client.query(queryText, values);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating library account:', error);
        res.status(500).send('Server error');
    }
};


// UPDATE operation
const getNewLibraryCard =  async (req, res) => {
    const accountId = parseInt(req.params.account_id);
    const card_number = req.body.card_number;
    try {
        const client = await pool.connect();

        card_number = parseInt(faker.string.uuid());
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
};

/*************************************
        Admin only table CRUD 
*************************************/


// Update library account
const updateLibraryAccount = async (req, res) => { //not for user
    const account_id = parseInt(req.params.account_id);
    const { member_id, card_number, num_checked_out_books, fines_to_pay, make_payment } = req.body;

    try {
        const client = await pool.connect();
        const queryText = 'UPDATE library_account SET member_id = $1, card_number = $2, num_checked_out_books = $3, fines_to_pay = $4, make_payment = $5 WHERE account_id = $6 RETURNING *';
        const values = [member_id, card_number, num_checked_out_books, fines_to_pay, make_payment, account_id];
        const { rows } = await client.query(queryText, values);
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error updating library account:', error);
        res.status(500).send('Server error');
    }
};

// DELETE operation
const deleteLibraryAccountById =  async (req, res) => {
    const accountId = parseInt(req.params.account_id);
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
};


module.exports = {
    getUserAccountById,
    createNewLibraryAccount,
    getUserLibraryAccountWithFines,
    getNewLibraryCard,
    
    //admin only
    updateLibraryAccount,
    deleteLibraryAccountById
}