const express = require('express');
const pool = require('../database')// Import your PostgreSQL connection pool

let api = express.Router(); //to create modular mountable route handlers

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
    audience: 'https://bibliothecaAPI',
    issuerBaseURL: `https://icodenow.auth0.com/`,
    tokenSigningAlg: 'RS256'
});

const checkScopes = requiredScopes('read:messages');


/********************************
        Holds table CRUD 
********************************/

// Gets all holds table 
api.get('/', async(req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM holds', (err, results) => {
        // handleErrorOrReturnData();
        if (err) {
            console.log('error oh noes!!', err)
            res.status(500).send('Server error');
            client.release()
        } 
        else {
            console.log('data fetched successfully');
            res.status(200).json(results.rows) // res.json(dbitems.rows)
            client.release()//closes database
        }
    })
})

// get holds by id
api.get('/:hold_id', async (req, res) => {
    const client = await pool.connect();
    let id = parseInt(req.params.hold_id);

    await client.query('SELECT * FROM holds WHERE hold_id = $1', [id], (err, result) => {
      if (err) {
          res.status(500).send(err);
          client.release()
      } 
      else { //res.json(dbitems.rows[0] )
          res.status(200).json(result.rows[0])
          client.release()
      }
    })
})

// Create a new hold
api.post('/holds/add', async (req, res) => {
    const { member_id, hold_date, expiry_date } = req.body;

    try {
        const client = await pool.connect();
        const queryText = `
            INSERT INTO holds (member_id, hold_date, expiry_date) 
            VALUES ($1, $2, $3) 
            RETURNING holds.*, library_account.*, users.*
            FROM holds
            JOIN library_account ON holds.member_id = library_account.member_id
            JOIN users ON library_account.member_id = users.member_id`;
        const values = [member_id, hold_date, expiry_date];
        const { rows } = await client.query(queryText, values);

        // Update reserves field in library_account to true
        await client.query('UPDATE library_account SET reserves = true WHERE member_id = $1', [member_id]);

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating hold:', error);
        res.status(500).send('Server error');
    }
});

// Delete a hold
api.delete('/holds/delete/:hold_id', async (req, res) => {
    const hold_id = req.params.hold_id;

    try {
        const client = await pool.connect();

        // Fetch the member_id associated with the hold
        const holdQuery = 'SELECT member_id FROM holds WHERE hold_id = $1';
        const { rows } = await client.query(holdQuery, [hold_id]);
        const member_id = rows[0].member_id;

        // Delete the hold
        await client.query('DELETE FROM holds WHERE hold_id = $1', [hold_id]);

        // Check if the member has any remaining holds
        const remainingHoldsQuery = 'SELECT COUNT(*) FROM holds WHERE member_id = $1';
        const { rows: holdCount } = await client.query(remainingHoldsQuery, [member_id]);
        const hasHolds = parseInt(holdCount[0].count) > 0;

        // Update reserves field in library_account based on remaining holds
        await client.query('UPDATE library_account SET reserves = $1 WHERE member_id = $2', [hasHolds, member_id]);

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting hold:', error);
        res.status(500).send('Server error');
    }
});




// update holds by holds id
api.put('/:hold_id', async (req, res) => {
    const client = await pool.connect();
    const holdId = parseInt(req.params.hold_id);
    const { book_id, member_id, hold_date, expiry_date } = req.body;
    
    try {
        let res = await client.query(
            'UPDATE holds SET book_id = $1 member_id = $2, hold_date = $3, expiry_date = $4 WHERE hold_id = $5 RETURNING *',
            [book_id, member_id, hold_date, expiry_date, holdId])
            res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
})

// delete by holds id
api.delete('/:hold_id', async (req, res) => {
    const client = await pool.connect();
    const holdsId = parseInt(req.params.hold_id);
   
    await client.query(
            'DELETE holds WHERE hold_id = $1', [holdsId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`holds:${holdsId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   })
})

// Read all holds with associated book and member information
api.get('/hold', async (req, res) => {
    try {
        const client = await pool.connect();
        const queryText = `
            SELECT h.*, b.title AS book_title, u.name AS member_name
            FROM holds h
            INNER JOIN book b ON h.book_id = b.book_id
            INNER JOIN users u ON h.member_id = u.member_id
        `;
        const { rows } = await client.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching holds:', error);
        res.status(500).send('Server error');
    }
});

// Update hold by id
// api.put('/hold/update/:hold_id', async (req, res) => {
//     const hold_id = req.params.hold_id;
//     const { book_id, member_id, expiry_date } = req.body;

//     try {
//         const client = await pool.connect();
//         const queryText = 'UPDATE holds SET book_id = $1, member_id = $2, expiry_date = $3 WHERE hold_id = $4 RETURNING *';
//         const values = [book_id, member_id, expiry_date, hold_id];
//         const { rows } = await client.query(queryText, values);
//         res.status(200).json(rows[0]);
//     } catch (error) {
//         console.error('Error updating hold:', error);
//         res.status(500).send('Server error');
//     }
// });



// Create a new hold
api.post('/holds/add', async (req, res) => {
    const { member_id, book_criteria, hold_date, expiry_date } = req.body;

    try {
        const client = await pool.connect();

        // Start a transaction
        await client.query('BEGIN');

        // Fetch the book_id based on the provided criteria
        const bookQuery = `
            SELECT book_id FROM book 
            WHERE title = $1 OR author = $1 OR isbn = $1;
        `;
        const { rows: bookResult } = await client.query(bookQuery, [book_criteria]);

        if (bookResult.length === 0) {
            res.status(404).send('Book not found.');
            return;
        }

        const book_id = bookResult[0].book_id;

        // Insert hold record
        const insertHoldQuery = `
            INSERT INTO holds (member_id, book_id, hold_date, expiry_date) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`;
        const holdValues = [member_id, book_id, hold_date, expiry_date];
        const { rows: newHold } = await client.query(insertHoldQuery, holdValues);

        // Update book_copy status to 'Reserved'
        const updateCopyQuery = 'UPDATE book_copy SET status = $1 WHERE book_id = $2';
        const copyStatus = 'Reserved';
        const { rowCount } = await client.query(updateCopyQuery, [copyStatus, book_id]);

        // If the book copy status was updated successfully
        if (rowCount === 1) {
            // Commit the transaction
            await client.query('COMMIT');
            res.status(201).json(newHold[0]);
        } else {
            // Rollback the transaction
            await client.query('ROLLBACK');
            res.status(400).send('Failed to reserve book. Book copy not found or already reserved.');
        }
    } catch (error) {
        console.error('Error creating hold:', error);
        // Rollback the transaction on error
        await client.query('ROLLBACK');
        res.status(500).send('Server error');
    } finally {
        // Release the client from the pool
        client.release();
    }
});

module.exports = api;
