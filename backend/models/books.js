const pool = require('../database')// Import your PostgreSQL connection pool

// // Helper function to handle database queries
// const query = async (text, params) => {
//     const client = await pool.connect();
//     try {
//         return await client.query(text, params);
//     } finally {
//         client.release();
//     }
// };
/********************************
        Books table CRUD 
********************************/

// Gets all books table 
const getBooks = async (req, res) => {
    const client = await pool.connect();

    await client.query('SELECT * FROM book ORDER BY book_id ASC', (err, results) => {

        if (err) {
            // console.log('error oh noes!!', err)
            res.status(500).send('Server error');
            throw err;
        } 
            res.status(200).json(results.rows) // res.json(dbitems.rows)
            client.release()//closes database
    })
}

// // get all books with library info
// const getBooksWithAuthorCategoryPublisher = async (req, res) => {
//     const client = await pool.connect();

//     await client.query(
//     `SELECT b1.title,
// 		b1.description,
// 		a1.author_name,
// 		b1.isbn,
// 		b1.pages,
// 		b1.publication_year,
// 		b1.language,
// 		c1.category_name,
// 		k2.copy_number,
// 		k2.status
// FROM book b1
// JOIN author a1 ON b1.book_id = a1.author_id
// JOIN category c1 ON b1.category_id = c1.category_id
// JOIN book_copy k2 ON b1.book_id = k2.book_id;
// RETURNING b1*`, (err, results) => {
//         if (err) {
//             // console.log('error oh noes!!', err)
//             res.status(500).send('Server error');
//             throw err;
//         } 
//             res.status(200).json(results.rows) // res.json(dbitems.rows)
//             client.release()//closes database
//     })
// }

  

        
        // SELECT b.title,
        //                 b.description,
        //                 a.author_name,
        //                 b.isbn,
        //                 b.pages,
        //                 p.publisher_name,
        //                 b.publication_year,
        //                 b.language,
        //                 c.category_name
        //             FROM book b
        //             JOIN author a ON b.author_id = a.author_id
        //             JOIN category c ON b.category_id = c.category_id
        //             JOIN publisher p ON b.publisher_id = p.publisher_id
        //             ORDER BY b.book_id

// Get book by id
const getBookById = async (req, res) => {
    const client = await pool.connect();

    let book_id = parseInt(req.params.book_id);

     await client.query('SELECT * FROM book WHERE book_id = $1', [book_id], (err, result) => {
      if (err) {
          res.status(500).send(err);
         
      } 
      else { //res.json(dbitems.rows[0] )
          res.status(200).json(result.rows[0])
          client.release()
      }
    })
}

// Get book by author name ///books-by-author/:authorName
//('/:authorName', 
const getBookByAuthorName = async (req, res) => {
    const client = await pool.connect()();

    let authorName = req.params.author_name;

    await client.query('SELECT b.* FROM book b JOIN author a ON b.author_id = a.author_id WHERE a.author_name = $1',
    [authorName], (err, result) => {
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

// Get book by publisher name ('/:publisherName', async
const getBookByPublisher = async (req, res) => {
    const client = await pool.connect();
    const publisherName = req.params.publisher_name;

     await client.query('SELECT b.* FROM book b JOIN publisher p ON b.publisher_id = p.publisher_id WHERE p.publisher_name = $1',
        [publisherName], (err, result) => {
        
    if (err) {
        console.log('error fetching book by publisher', err)
          res.status(500).send(err);
          client.release()
      } 
      else { //res.json(dbitems.rows[0] )
          res.status(200).json(result.rows[0])
          client.release()
      }
    })
}

// Get book by category name // ('/category/:categoryName', async 
const getBookByCategory = async (req, res) => {
    const client = await pool.connect();

    const categoryName = req.params.category_name;

    await client.query('SELECT b.* FROM book b JOIN category c ON b.category_id = c.category_id WHERE c.category_name = $1',
        [categoryName], (err, result) => {
            if (err) {
                console.log('error fetching book by category', err)
                res.status(500).send(err);
                client.release()
            }
            else { //res.json(dbitems.rows[0] )
                res.status(200).json(result.rows[0])
                client.release()
            }
        })
};
/* //////////////////////////////////////////////////////////

    Borrow - Renew - Return book - Specifically for Users

////////////////////////////////////////////////////////////*/

// Borrow a book //('/borrow/:book_id',
const createBorrowBook = async (req, res) => {
  const client = await pool.connect();
  try {
    const { book_id } = req.params;
    const { member_id } = req.body;

    // Check if the book is available for borrowing
    const availableCopy = await client.query('SELECT * FROM book_copy WHERE book_id = $1 AND status = $2 LIMIT 1', [book_id, 'Available']);
    if (availableCopy.rows.length === 0) { 
      return res.status(400).json({ error: 'Book is not available for borrowing' });
    }

    // Start a transaction
    // Update the status of the book copy to "Borrowed"
    await client.query('UPDATE book_copy SET status = $1 WHERE copy_id = $2 RETURNING *', ['Borrowed', availableCopy.rows[0].copy_id]);

    // Update library account: increment num_checked_out_books
    await client.query('UPDATE library_account SET num_checked_out_books = num_checked_out_books + 1 WHERE member_id = $1', [member_id]);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // Add 14 days

    // Insert a new record into the transaction table
    await client.query(
      'INSERT INTO transaction (member_id, copy_id, transaction_type, transaction_date, due_date, automated_transaction) VALUES ($1, $2, $3, CURRENT_TIMESTAMP,, $5, true)',
      [member_id, availableCopy.rows[0].copy_id, 'Borrow', dueDate] // Adjust 'Auth0 sub_id' as needed
    );

    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error borrowing book:', error);
    res.status(500).json({ error: 'Error borrowing book' });
  } finally {
    client.release();
  }
};

//renewBook - extending by 14 days
const createRenewBook = async (req, res) => {
    const client = await pool.connect();

    try {
        const { transaction_id } = req.body;

        // Get the current due date of the transaction
        const currentDueDateQuery = await client.query('SELECT due_date FROM transaction WHERE transaction_id = $1', [transaction_id]);
        const currentDueDate = currentDueDateQuery.rows[0].due_date;

        // update due date of the transaction
        const renewTransactionQuery = await client.query('UPDATE transaction SET due_date = CURRENT_DATE + INTERVAL \'14 days\' WHERE transaction_id = $1 RETURNING *', [transaction_id]);

        // copy_id associated with the transaction
        const copyIdQuery = await client.query('SELECT copy_id FROM transaction WHERE transaction_id = $1', [transaction_id]);
        const copyId = copyIdQuery.rows[0].copy_id;

        // Update the status of the book copy to renewed
        await client.query('UPDATE book_copy SET status = $1 WHERE copy_id = $2', ['Borrowed', copyId]);


        res.status(200).json(renewTransactionQuery.rows[0]);
    } catch (err) {
        console.error('Error renewing book:', err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
};

// Endpoint to return a book ('/books/return', async
const createReturnBook = async (req, res) => {
    const { transaction_id, copy_id, returned_by } = req.body;
    const client = await pool.connect();

    try {
        // Update book copy status to "Available"
        const updateCopyQuery = 'UPDATE book_copy SET status = $1 WHERE copy_id = $2 RETURNING *';
        const copyStatus = 'Available';
        const { rows: updatedCopy } = await client.query(updateCopyQuery, [copyStatus, copy_id]);

        // Update library account: decrement num_checked_out_books
        const getTransactionQuery = 'SELECT member_id FROM transaction WHERE transaction_id = $1';
        const { rows: transactionResult } = await client.query(getTransactionQuery, [transaction_id]);
        const member_id = transactionResult[0].member_id;

        await client.query('UPDATE library_account SET num_checked_out_books = num_checked_out_books - 1 WHERE member_id = $1 ', [member_id]);

        // Create transaction record for return
        const insertReturnTransactionQuery = 'INSERT INTO transaction (transaction_type, copy_id, CURRENT_TIMESTAMP, automated_transaction) VALUES ($1, $2, true) RETURNING *';
        const transactionType = 'Return';
        const { rows: newTransaction } = await client.query(insertReturnTransactionQuery, [transactionType, copy_id]);


        res.status(201).json({ updatedCopy: updatedCopy[0], newTransaction: newTransaction[0] });
    } catch (error) {
        // If an error occurs, rollback the transaction
        await client.query('ROLLBACK');
        console.error('Error returning book:', error);
        res.status(500).send('Server error');
    } finally {
        // Release the client from the pool
        client.release();
    }
};

/********************************************************* 
 
 Create, Update, Delete - Done only by Librarian or Admin

********************************************************* */

// Add new book 
const createBook = async (req, res) => {
    const client = await pool.connect();

    try {
          // Input validation
        const { title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language, num_copies } = req.body;
        if (!title || !author_id || !publisher_id || !category_id || !num_copies) {
            return res.status(400).send('Required fields missing');
        }

        // Merge queries using Common Table Expressions (CTEs)
        const query = `
            WITH author_insert AS (
                INSERT INTO author (author_name)
                VALUES ($1)
                ON CONFLICT DO NOTHING
                RETURNING author_id
            ),
            publisher_insert AS (
                INSERT INTO publisher (publisher_name)
                VALUES ($2)
                ON CONFLICT DO NOTHING
                RETURNING publisher_id
            ),
            category_insert AS (
                INSERT INTO category (category_name)
                VALUES ($3)
                ON CONFLICT DO NOTHING
                RETURNING category_id
            ),
            book_insert AS (
                INSERT INTO book (title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language)
                SELECT $4, COALESCE((SELECT author_id FROM author_insert), $5), COALESCE((SELECT publisher_id FROM publisher_insert), $6), COALESCE((SELECT category_id FROM category_insert), $7), $8, $9, $10, $11, $12
                RETURNING *
            ),
            next_copy_number AS (
                SELECT get_next_copy_number((SELECT book_id FROM book_insert)) AS next_copy_number
            )
            INSERT INTO book_copy (book_id, copy_number, status)
            SELECT (SELECT book_id FROM book_insert), next_copy_number + row_number() OVER (), 'Available'
            FROM next_copy_number
            CROSS JOIN generate_series(1, $13) AS s
            RETURNING *;
        `;
        
        const values = [
            author_name, publisher_name, category_name,
            title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language,
            num_copies
        ];

        const issued_by = 'Auth0';

        const { rows: bookRows } = await client.query(query, values);

        const bookId = bookRows[0].book_id;

        await client.query(
            'INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)',
            [bookId, 'Book Creation', issued_by]
        );

        res.status(200).send('Book added successfully');
    } catch (error) {

        console.error('Error creating book:', error);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
};

// Update book by book_id ('/:book_id', async 
const updateBook = async (req, res) => {
    const client = await pool.connect();

    const bookId = parseInt(req.params.book_id);
    const { title, author_name, publisher_name, category_name, description, publication_year, pages, isbn, language } = req.body;

    try {

        // update 
        const result = await client.query(`
            UPDATE book AS b
            SET 
                title = $1,
                author_id = (SELECT author_id FROM author WHERE author_name = $2),
                publisher_id = (SELECT publisher_id FROM publisher WHERE publisher_name = $3),
                category_id = (SELECT category_id FROM category WHERE category_name = $4),
                description = $5,
                publication_year = $6,
                pages = $7,
                isbn = $8,
                language = $9
            WHERE 
                b.book_id = $10
            RETURNING b.*
        `, [title, author_name, publisher_name, category_name, description, publication_year, pages, isbn, language, bookId]);

        // Insert entry into the transaction table
     
        const issued_by = 'AUTH_0'// req.user.sub; // Need to get admin id info

        await client.query(
            'INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)',
            [bookId, 'Update', issued_by]
        );

        // Commit transaction
        await client.query('COMMIT');

        res.status(200).json(result.rows[0]);
    } catch (err) {
      
        console.error('Error updating book:', err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
};

// Delete all books with book id = $1 ('/:book_id',
const deleteBook = async (req, res) => {
    const client = await pool.connect();

    const bookId = parseInt(req.params.book_id);

    try {
        // Update transactions for all copies of the book to 'Canceled' and delete copies
        await client.query(`
            WITH deleted_transactions AS (
                UPDATE "transaction" 
                SET transaction_type = 'Canceled' 
                WHERE copy_id IN (SELECT copy_id FROM book_copy WHERE book_id = $1)
                RETURNING copy_id
            )
            DELETE FROM book_copy 
            WHERE copy_id IN (SELECT copy_id FROM deleted_transactions)
        `, [bookId]);

        // Delete the book
        await client.query('DELETE FROM book WHERE book_id = $1', [bookId]);

        console.log(`Book with ID ${bookId} and all its copies were successfully deleted`);

        res.status(200).send(`Book with ID ${bookId} and all its copies were successfully deleted`);
    } catch (error) {
        // Rollback the transaction on error
        await client.query('ROLLBACK');

        console.error('Error deleting book:', error);
        res.status(500).send('There was a server error');
    } finally {
        client.release();
    }
};

module.exports = {
    getBooks,
    // getBooksWithAuthorCategoryPublisher,
    getBookById,
    getBookByAuthorName,
    getBookByPublisher,
    getBookByCategory,
    createBorrowBook,
    createRenewBook,
    createReturnBook,
    createBook,
    createBorrowBook,
    updateBook,
    deleteBook, 
}



// const updateBook = async (req, res) => {
//     const client =  await pool.pool.connect();

//     const bookId = parseInt(req.params.book_id);
    
//     const { title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language } = req.body;
    
//     try {
//         let result =  await client.query(
//             'UPDATE book SET title = $1, author_id = $2, publisher_id = $3, category_id = $4, description = $5, publication_year = $6, pages = $7, isbn = $8, language = $9  WHERE book_id = $10 RETURNING *',
          
//             [title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language])
        
//           const issued_by = 'Auth0 admin id'; // need to get admin info
        
//         // Insert entry into the transaction table
//         await client.query(
//             'INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *',
//             [bookId, 'Update', issued_by]
//         );
        
//         res.status(200).json(result.rows[0])
//         res.status(200).json(`This user with the id: ${bookId} was updated!`)
//     } catch (err) {
//         res.status(500).send(err);
//     } finally {
//         client.release()
//     }
// };



// Endpoint to loan out a book - might now use this query
// const post('/loan', async (req, res) => {
//     const { member_id, copy_id, due_date, issued_by } = req.body;

//     try {
//         const client =  pool.pool.connect();
        
//         // Start a transaction
//          await client.query('BEGIN');

//         // Update book copy status
//         const updateCopyQuery = 'UPDATE book_copy SET status = $1 WHERE copy_id = $2 RETURNING *';
//         const copyStatus = 'Borrowed';
//         const { rows: updatedCopy } =  await client.query(updateCopyQuery, [copyStatus, copy_id]);
        
//         // Update library account: increment num_checked_out_books
//          await client.query('UPDATE library_account SET num_checked_out_books = num_checked_out_books + 1 WHERE member_id = $1', [member_id]);

//         // Create transaction record
//         const insertTransactionQuery = 'INSERT INTO transaction (member_id, copy_id, transaction_type, due_date, issued_by) VALUES ($1, $2, $3, $4, $5) RETURNING *';
//         const transactionType = 'Loan';
//         const { rows: newTransaction } =  await client.query(insertTransactionQuery, [member_id, copy_id, transactionType, due_date, issued_by]);

//         // Commit the transaction
//          await client.query('COMMIT');

//         res.status(201).json({ updatedCopy: updatedCopy[0], newTransaction: newTransaction[0] });
//     } catch (error) {
//         // // If an error occurs, rollback the transaction
//         //  await client.query('ROLLBACK');
//         console.error('Error loaning out book:', error);
//         res.status(500).send('Server error');
//     } finally {
//         // Release the client from the pool
//         client.release();
//     }
// });

// const deleteBookV1 = async (req, res) => {

//     const client =  await pool.pool.connect();

//     const bookId = parseInt(req.params.book_id);
//     const title = req.params.title;

//     try {

//         const bookTitleRes = await client.query('SELECT title FROM book WHERE book_id = $1', [bookId]);
//         const bookTitle = bookTitleRes.rows[0].title;

//         const bookCopiesRes =  await client.query('SELECT copy_id FROM book_copy WHERE book_id = $1', [bookId]);
//         const bookCopies = bookCopiesRes.rows;

//         // Update the transaction
//         for (const copy of bookCopies) {
//             await client.query('UPDATE transaction SET transaction_type = $1 WHERE copy_id = $2', ['Canceled', copy.copy_id]);
//              // delete book and it's copies
//             await client.query('DELETE FROM book_copy WHERE book_id = $1', [bookId]);
//         }

//          await client.query('DELETE FROM book WHERE book_id = $1', [bookId]);

//         console.log(`Book:${bookTitle} - ${bookId} was successfully deleted`);

//         res.status(200).send(`Books:${title} - ${bookId} was successfully deleted`);

//     } catch (error) {
//         console.error('Error deleting book:', error);
//         res.status(500).send('There is a server error');
//     } finally {
//         client.release();
//     }
// };