const express = require('express');
const pool = require('../database')// Import your PostgreSQL connection pool

let api = express.Router(); 

// api.use(function(req, res, next) {
//     res._json = res.json;
//     res.json = function json(obj) {
//         obj.apiVersion = 1;
//         res._json(obj);
//     }
//     next();
// })


/*********************************************
        Book_copy AKA BOOK COPIES table CRUD 
**********************************************/

// get copies of all book_copy
api.get('/', async (req, res) => {
    const client = await pool.connect();

    await client.query('SELECT * FROM book_copy', (err, result) => {
        if (err) {
            console.log('you have an error');
            res.status(500).send('Server error');
            client.release()
        }
        else {
            res.status(200).json(results.rows);
            client.release();
        }
    })
})

// get by copy id
api.get('/:copy_id', async (req, res) => {
    const client = await pool.connect();
    let bookCopyId = parseInt(req.params.copy_id);

    await client.query(`
            SELECT b.title, b.description, b.publication_year, b.pages, b.isbn, b.language,
                   bc.copy_id, bc.copy_number, bc.status,
                   a.author_name, p.publisher_name
            FROM book_copy bc
            INNER JOIN book b ON bc.book_id = b.book_id
            LEFT JOIN author a ON b.author_id = a.author_id
            LEFT JOIN publisher p ON b.publisher_id = p.publisher_id
            WHERE bc.copy_id = $1
        `, [bookCopyId], (err, result) => {
        if (err) {
            res.status(500).send(err);
            client.release()
        }
        else {
            res.status(200).json(result.rows[0]);
            client.release();
        }
    })
})

// edit status of copy id
api.put('/:copy_id', async (req, res) => {
    const client = await pool.connect();

    const copyId = parseInt(req.params.copy_id);
    const { status } = req.body;

  try {
      await client.query('UPDATE book_copy SET status = $1 WHERE copy_id = $2', [status, copyId]);
      
    // Add to transaction table
      await client.query('INSERT INTO transaction (copy_id, transaction_type, transaction_date) VALUES ($1, $2, CURRENT_TIMESTAMP)', [copyId, 'Update Status']);
      
        res.status(200).json(`Book copy with ID ${copyId} was updated successfully`);
    } catch (err) {
        console.error('Error updating book copy:', err);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }

})

// delete a copy of a book
api.delete('/delete/:copy_id', async (req, res) => {

    const client = await pool.connect();

    const bookcopy_id = parseInt(req.params.bookcopy_id);

    try {
        await client.query('DELETE FROM book_copy WHERE copy_id = $1', [bookId]);

        console.log(`Book:${title} - ${bookId} was successfully deleted`);

        res.status(200).send(`Books:${title} - ${bookId} was successfully deleted`);

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('There is a server error');
    } finally {
        client.release();
    }
});

// delete all copies of a book & book
api.delete('/delete/:copies', async (req, res) => {

    const client = await pool.connect();

    const bookcopy_id = parseInt(req.params.bookcopy_id);

    try {

        await client.query('DELETE FROM book_copy WHERE book_id = $1', [bookId]);

        await client.query('DELETE FROM book WHERE book_id = $1, [bookId]');

        console.log(`Book:${title} - ${bookId} was successfully deleted`);

        res.status(200).send(`Books:${title} - ${bookId} was successfully deleted`);

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('There is a server error');
    } finally {
        client.release();
    }
});

module.exports = api;