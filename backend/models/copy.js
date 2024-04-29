
const pool = require('../database'); 


/*********************************************
        
Book_copy AKA BOOK COPIES table CRUD 

**********************************************/

// get copies of all book_copy
const getBookCopies = async (req, res) => {
    const client = await pool.connect();

    await client.query('SELECT * FROM book_copy', (err, result) => {

        if (err) {
          res.status(500).send(err);
      } 
      else { 
          res.status(200).json(result.rows)
          client.release()
      }
    })
};

// get by copy id- should get all copies of one book by id
const getBookCopiesById = async (req, res) => {
    try {
        const client = await pool.connect();
        const bookCopyId = parseInt(req.params.copy_id);

        const result = await client.query(`
            SELECT b.title, b.description, b.publication_year, b.pages, b.isbn, b.language,
                   bc.copy_id, bc.copy_number, bc.status,
                   a.author_name, p.publisher_name
            FROM book_copy bc
            INNER JOIN book b ON bc.book_id = b.book_id
            LEFT JOIN author a ON b.author_id = a.author_id
            LEFT JOIN publisher p ON b.publisher_id = p.publisher_id
            WHERE bc.copy_id = $1
        `, [bookCopyId]);

        if (result.rows.length === 0) {
            res.status(404).send("Copy not found");
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error fetching copy:', error);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
};

/********************************************************* 
 
    Create - Update - Delete - Done only by Librarian or Admin 

********************************************************* */

// create a book copy
const createBookCopy = async (req, res) => {
    const { book_id, status } = req.body;
    
  try {
    const client = await pool.connect();

      //function created beforehand in psql to handle copies see sql schema
      const getNextCopyNumberQuery = `SELECT get_next_copy_number($1) AS next_copy_number`;
      
    const nextCopyNumberResult = await client.query(getNextCopyNumberQuery, [book_id]);
    const nextCopyNumber = nextCopyNumberResult.rows[0].next_copy_number;

    // insert new copy into the book_copy table with the next copy number
    const queryText = `
      INSERT INTO book_copy (book_id, copy_number, status) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
      
    const values = [book_id, nextCopyNumber, status || 'Available'];

    const result = await client.query(queryText, values);
    const copyId = result.rows[0].copy_id;

    const issued_by = 'Auth0'
  
    await client.query(
      'INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)',
      [copyId, 'Added copy of book', issued_by]
    );

    res.status(201).json(result.rows[0]);
    client.release();
  } catch (error) {
    console.error('Error creating book copy:', error);
    res.status(500).send('Server error');
  }
};

// edit status of copy id ('/:copy_id', 
const editCopyById = async (req, res) => {
    const client = await pool.connect();

    const copyId = parseInt(req.params.copy_id);
    const { status } = req.body;

  try {
      await client.query('UPDATE book_copy SET status = $1 WHERE copy_id = $2 RETURNING *' , [status, copyId]);
      
      const issued_by = 'Auth0';
    // Add to transaction table //issued by
      await client.query('INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *', [copyId, 'Update Status']);
      
        res.status(200).json(`Book copy with ID ${copyId} was updated successfully`);
    } catch (err) {
        console.error('Error updating book copy:', err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }

}

// delete a copy of a book ('/delete/:copy_id', 
const deleteByCopyId = async (req, res) => {
    const client = await pool.connect();
    const copyId = parseInt(req.params.copy_id);

    try {
        // Get the book_id of the copy being deleted
        const copyInfo = await client.query('SELECT book_id, copy_number FROM book_copy WHERE copy_id = $1', [copyId]);
        const { book_id, copy_number } = copyInfo.rows[0];

        // Delete the copy
        await client.query('DELETE FROM book_copy WHERE copy_id = $1', [copyId]);

        const issued_by = 'Auth0 admin' //admin req.param.sub_id? 

        await client.query(
        'INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *',
        [copyId, 'Delete Copy', issued_by]
        );
        
        // Update the copy numbers of remaining copies of the same book
        await client.query('UPDATE book_copy SET copy_number = copy_number - 1 WHERE book_id = $1 AND copy_number > $2', [book_id, copy_number]);

        res.status(200).send(`Book copy ${copyId} was successfully deleted`);
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('There was a server error');
    } finally {
        client.release();
    }
};

// Delete from book table - the book = all copies of the book
// // delete all copies of a book & book '/delete/:copies', 
// const deleteAllCopies = async (req, res) => {

//     const client = await pool.connect();
//     const bookId = parseInt(req.params.book_id);

//     try {

//         await client.query('DELETE FROM book_copy WHERE book_id = $1', [bookId]);

//         await client.query('DELETE FROM book WHERE book_id = $1', [bookId]);

//         await client.query(
//         'INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *',
//         [copyId, 'Delete Copy', issued_by]
//         );

//         console.log(`Book:${title} - ${bookId} was successfully deleted`);

//         res.status(200).send(`Books:${title} - ${bookId} was successfully deleted`);

//     } catch (error) {
//         console.error('Error deleting book:', error);
//         res.status(500).send('There is a server error');
//     } finally {
//         client.release();
//     }
// };

module.exports = {
    getBookCopies,
    getBookCopiesById,
    createBookCopy,
    editCopyById,
    deleteByCopyId
};