const pool = require('../database')



/********************************
        Holds table CRUD 
********************************/

// Gets all holds table 
const getAllHolds = async (req, res) => {
   
    const client = await pool.connect();

    client.query('SELECT * FROM holds ORDER BY hold_id ASC', (err, results) => {
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
};

//for repoart ? 
const getHoldDetails = async (req, res) => {
    const client = await pool.connect();
    
    client.query(
        `SELECT h.*, b.title AS book_title, bc.copy_number, bc.status AS book_status
        FROM holds h
        JOIN book_copy bc ON h.copy_id = bc.copy_id
        JOIN book b ON bc.book_id = b.book_id`, (err, results) => {
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
};

// get holds by id
const getReservedBook =  async (req, res) => {
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
}

// User Create a new hold
/* if book_copy id is placed on reserve, create hold data and expire after 24 hours if a member doesn't borrow the book, using */
const createBookOnHold = async (req, res) => {
    const { member_id, expiry_date, book_copy_id } = req.body;

    try {
        const client = await pool.connect();

        // Insert hold record
        const insertHoldQuery = `
            INSERT INTO holds (member_id, start_date, expiry_date, book_copy_id) 
            VALUES ($1, CURRENT_TIMESTAMP, $2, $3) 
            RETURNING *;
        `;
        const holdValues = [member_id, expiry_date, book_copy_id];
        const { rows } = await client.query(insertHoldQuery, holdValues);

        // Update book status to 'Reserved'
        await client.query(
            'UPDATE book_copy SET status = \'Reserved\' WHERE copy_id = $1',
            [book_copy_id]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating hold:', error);
        res.status(500).send('Server error');
    }
};


// Delete a hold
const deleteHold = async (req, res) => {
    const hold_id = req.params.hold_id;

    try {
        const client = await pool.connect();

        // Fetch the member_id and book_copy_id associated with the hold
        const holdQuery = 'SELECT member_id, book_copy_id FROM holds WHERE hold_id = $1';
        const { rows } = await client.query(holdQuery, [hold_id]);
        // const member_id = rows[0].member_id;
        const book_copy_id = rows[0].book_copy_id;

        // Delete the hold
        await client.query('DELETE FROM holds WHERE hold_id = $1', [hold_id]);

        // // Check if the member has any remaining holds
        const remainingHoldsQuery = 'SELECT COUNT(*) FROM holds WHERE member_id = $1';
        const { rows: holdCount } = await client.query(remainingHoldsQuery, [member_id]);
        const hasHolds = parseInt(holdCount[0].count) > 0;

              // update book status to 'Available'
        await client.query(
            'UPDATE book_copy SET status = \'Available\' WHERE copy_id = $1',
            [book_copy_id]
        );

        res.status(204).end();
    } catch (error) {
        console.error('Error deleting hold:', error);
        res.status(500).send('Server error');
    }
};


// for reports
// Read all holds with associated book and member information
const getAllBooksaAndMemberPlacingHolds = async (req, res) => {
    try {
        const client = await pool.connect();
        const queryText = `
            SELECT h.*, b.title AS book_title, u.name AS member_name
            FROM holds h
            INNER JOIN book b ON b.book_id = b.book_id
            INNER JOIN users u ON h.member_id = u.member_id;
        `;
        const { rows } = await client.query(queryText);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching holds:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllHolds, 
    getReservedBook,
    getHoldDetails,
    createBookOnHold,
    deleteHold,
    getAllBooksaAndMemberPlacingHolds
}






// // Create a new hold
// api.post('/holds/add', async (req, res) => {
//     const { member_id, book_criteria, hold_date, expiry_date } = req.body;

//     try {
//         const client = await pool.connect();

//         // Start a transaction
//         await client.query('BEGIN');

//         // Fetch the book_id based on the provided criteria
//         const bookQuery = `
//             SELECT book_id FROM book 
//             WHERE title = $1 OR author = $1 OR isbn = $1;
//         `;
//         const { rows: bookResult } = await client.query(bookQuery, [book_criteria]);

//         if (bookResult.length === 0) {
//             res.status(404).send('Book not found.');
//             return;
//         }

//         const book_id = bookResult[0].book_id;

//         // Insert hold record
//         const insertHoldQuery = `
//             INSERT INTO holds (member_id, book_id, start_date, expiry_date) 
//             VALUES ($1, $2, $3, $4) 
//             RETURNING *`;
//         const holdValues = [member_id, book_id, start_date, expiry_date];
//         const { rows: newHold } = await client.query(insertHoldQuery, holdValues);

//         // Update book_copy status to 'Reserved'
//         const updateCopyQuery = 'UPDATE book_copy SET status = $1 WHERE book_id = $2';
//         const copyStatus = 'Reserved';
//         const { rowCount } = await client.query(updateCopyQuery, [copyStatus, book_id]);

//         // If the book copy status was updated successfully
//         if (rowCount === 1) {
//             // Commit the transaction
//             await client.query('COMMIT');
//             res.status(201).json(newHold[0]);
//         } else {
//             // Rollback the transaction
//             await client.query('ROLLBACK');
//             res.status(400).send('Failed to reserve book. Book copy not found or already reserved.');
//         }
//     } catch (error) {
//         console.error('Error creating hold:', error);
//         // Rollback the transaction on error
//         await client.query('ROLLBACK');
//         res.status(500).send('Server error');
//     } finally {
//         // Release the client from the pool
//         client.release();
//     }
// });


