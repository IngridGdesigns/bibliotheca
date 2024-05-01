const pool = require('../database'); 

// Get a list of fines for a specific user.
// Pay a fine.
// Get details of a specific fine.
// Update fine details (if necessary).

/********************************
        Fines table CRUD 
********************************/

// Read all fines with associated member information 
const getfines = async (req, res) => {
    const client = await pool.connect();

    await client.query('SELECT * FROM fine', (err, results) => {

        if (err) {
            // console.log('error oh noes!!', err)
            res.status(500).send('Server error');
        } 
            res.status(200).json(results.rows) // res.json(dbitems.rows)
            client.release()//closes database
    })
}


// get all fines my member id
// const getfinesByMemberId = async (req, res) => {
//     const client = await pool.connect();
//     const memberId = parseInt(req.params.member_id);

//     await client.query('SELECT * FROM fine WHERE member_id =$1', [memberId], (err, result) => {
//         if (err) {
//           res.status(500).send(err);
//       } 
//       else { 
//           res.status(200).json(result.rows)
//           client.release()
//       }
//     })
// };

// // Update fine, add transaction for fine payment:fine_id/pay
// const userPayFine = async (req, res) => {
//     const fine_id = parseInt(req.params.fine_id);
//     const { amount_paid } = req.body; // create form to get amount

//     try {
//         const client = await pool.connect();
//         // Fetch existing fine details
//         const fetchFineQuery = 'SELECT * FROM fine WHERE fine_id = $1';
//         const fetchFineValues = [fine_id];
//         const { rows: fineRows } = await client.query(fetchFineQuery, fetchFineValues);
//         if (fineRows.length === 0) {
//             return res.status(404).send('Fine not found');
//         }

//         // Calculate remaining amount after payment
//         const originalAmount = fineRows[0].amount;
//         const remainingAmount = originalAmount - amount_paid;

//         // Update fine
//         const updateFineQuery = 'UPDATE fine SET amount = $1 WHERE fine_id = $2 RETURNING *';
//         const updateFineValues = [remainingAmount, fine_id];
//         const { rows: updatedFineRows } = await client.query(updateFineQuery, updateFineValues);

//         // Add transaction for fine payment
//         const addTransactionQuery = 'INSERT INTO transaction (member_id, transaction_type, transaction_date, automated_transaction, fine_id) VALUES ($1, $2, CURRENT_TIMESTAMP, true, $3) RETURNING *';
//         const addTransactionValues = [fineRows[0].member_id, 'Fine Payment', fine_id];
//         const { rows: transactionRows } = await client.query(addTransactionQuery, addTransactionValues);

//         res.status(200).json({
//             fine: updatedFineRows[0],
//             transaction: transactionRows[0]
//         });
//     } catch (error) {
//         console.error('Error updating fine and adding transaction for payment:', error);
//         res.status(500).send('Server error');
//     }
// };


// /********************************************************* 
 
//     Create - Update - Delete - Done only by Librarian or Admin -- MVP 

// ********************************************************* */


// // Create new fine
// const createDamagedOrLostFee = async (req, res) => {
//     const { amount, reason, member_id, copy_id } = req.body;
//     const issued_by = 'Auth0' // auth_0 admin

//     try {
//         const client = await pool.connect();
   
//         const copyQuery = await client.query('SELECT status FROM book_copy WHERE copy_id = $1', [copy_id]);
//         const status = copyQuery.rows[0].status;

//         // Check if the book is lost or damaged
//         if (status === 'Lost' || status === 'Damaged') {
            
//             const feeAmount = status === 'Damaged' ? 20 : 40; // This is just a placeholder, replace with your fee calculation

//             // Insert the fine into the fine table
//             const fineQueryText = 'INSERT INTO fine (amount, reason, member_id) VALUES ($1, $2, $3) RETURNING fine_id';
//             const fineValues = [feeAmount, reason, member_id];
//             const fineResult = await client.query(fineQueryText, fineValues);
//             const fine_id = fineResult.rows[0].fine_id;

//             // RECORD tranasaction
//             const transactionQueryText = 'INSERT INTO transaction (member_id, copy_id, transaction_type, transaction_date, issued_by, fine_id) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5) RETURNING *';
//             const transactionValues = [member_id, copy_id, 'Fine Payment', issued_by, fine_id];
//             const transactionResult = await client.query(transactionQueryText, transactionValues);

//             res.status(201).json(transactionResult.rows[0]);
//         } else {
//             // Book copy is not lost or damaged, return an error response
//             res.status(400).send('Cannot create fine for non-lost or non-damaged book copy, this library doesn\'t believe in late fees');
//         }
//     } catch (error) {
//         console.error('Error creating fine and transaction:', error);
//         res.status(500).send('Server error');
//     }
// };

// // Update fine
// const updateFine = async (req, res) => {
//     const fine_id = parseInt(req.params.fine_id);
//     const { amount, reason, member_id, copy_id } = req.body;
//     const issued_by = 'Auth0' //autho person

//     try {
//         const client = await pool.connect();
//         // Update fine
//         const updateFineQuery = 'UPDATE fine SET amount = $1, reason = $2, member_id = $3 WHERE fine_id = $4 RETURNING *';
//         const updateFineValues = [amount, reason, member_id, fine_id];
//         const { rows: updatedFineRows } = await client.query(updateFineQuery, updateFineValues);
        
//         // Add transaction
//         const addTransactionQuery = 'INSERT INTO transaction (member_id, copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING *';
//         const addTransactionValues = [member_id, copy_id, 'Fine Payment', issued_by];
//         const { rows: transactionRows } = await client.query(addTransactionQuery, addTransactionValues);

//         res.status(200).json({ fine: updatedFineRows[0], transaction: transactionRows[0] });
//     } catch (error) {
//         console.error('Error updating fine and adding transaction:', error);
//         res.status(500).send('Server error');
//     }
// };


// // delete fine
// const deleteFine = async (req, res) => {
//     const fine_id = parseInt(req.params.fine_id);
//     const member_id = parseInt(req.params.member_id);
//     const copy_id = parseInt(req.params.copy_id)
//     const issued_by = 'AUTH 0 person' // need to get from auth0

//     try {
//         const client = await pool.connect();
        
//         // Delete the fine
//         await client.query('DELETE FROM fine WHERE fine_id = $1', [fine_id]);
        
//         // Add transaction if fine is related to a book copy (assuming copy_id is available)
//         await client.query('INSERT INTO transaction (member_id, copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING *',
//         [member_id, copy_id, 'Fine Deletion', issued_by]); // Assuming transaction type as 'Fine Deletion'
        
//         res.status(204).send();
//     } catch (error) {
//         console.error('Error deleting fine:', error);
//         res.status(500).send('Server error');
//     }
// };

module.exports = {
    getfines, 
    // getfinesByMemberId, 
    // userPayFine,
    // createDamagedOrLostFee,
    // updateFine,
    // deleteFine
}

// api.delete('/:fine_id', async (req, res) => {
//     const fine_id = req.params.fine_id;

//     try {
//         const client = await pool.connect();
//         await client.query('SELECT * FROM book_copy WHERE copy_id = $1', [[fine_id]])
//         await client.query('DELETE FROM fine WHERE fine_id = $1', [fine_id]);
//           // Add transaction
//         await client.query('INSERT INTO transaction (member_id, copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) RETURNING *',
//         [member_id, copy_id, transaction]);
        
//         res.status(204).send();
//     } catch (error) {
//         console.error('Error deleting fine:', error);
//         res.status(500).send('Server error');
//     }
// });