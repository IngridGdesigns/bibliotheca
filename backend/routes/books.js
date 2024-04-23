const express = require('express');
const pool = require('./db'); // Import your PostgreSQL connection pool

let api = express.Router(); 

api.use(function(req, res, next) {
    res._json = res.json;
    res.json = function json(obj) {
        obj.apiVersion = 1;
        res._json(obj);
    }
    next();
})

/********************************
        Books table CRUD 
********************************/

// Gets all books table 
api.get('/', async(req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM book', (err, results) => {

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

// Get book by id
api.get('/:book_id', async (req, res) => {
    const client = await pool.connect();

    let id = parseInt(req.params.book_id);

    await client.query('SELECT * FROM book WHERE book_id =$1', [id], (err, result) => {
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

// Get book by author name ///books-by-author/:authorName
api.get('/:authorName', async (req, res) => {
    const client = await pool.connect();

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
})

// Get book by category name
api.get('/category/:categoryName', async (req, res) => {
    const client = await pool.connect();

    const categoryName = req.params.category_name;

    await client.query('SELECT b.* FROM book b JOIN category c ON b.category_id = c.category_id WHERE c.category_name = $1',
    [categoryName], (err, result) => {
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


// Get book by publisher name
api.get('/:publisherName', async (req, res) => {
    const client = await pool.connect();

    await client.query('SELECT b.* FROM book b JOIN publisher p ON b.publisher_id = p.publisher_id WHERE p.publisher_name = $1',
        [id], (err, result) => {
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

/********************************************************* 
 
 Create, Update, Delete - Done only by Librarian or Admin

********************************************************* */

// Add new book 
api.post('/add', async (req, res) => {
    const client = await pool.connect();

    try {
         // Input validation
        const { title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language } = req.body;
        if (!title || !author_id || !publisher_id || !category_id) {
            return res.status(400).send('Required fields missing');
        }

        // Insert data into `author` table if it doesn't exist
        let authorId = null;
        const authorQueryResult = await client.query('INSERT INTO author (author_name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING author_id', [author_name]);
        if (authorQueryResult.rows.length > 0) {
            authorId = authorQueryResult.rows[0].author_id;
        } else {
            const authorIdQueryResult = await client.query('SELECT author_id FROM author WHERE author_name = $1', [author_name]);
            authorId = authorIdQueryResult.rows[0].author_id;
        }

        // Insert data into `publisher` table if it doesn't exist
        let publisherId = null;
        const publisherQueryResult = await client.query('INSERT INTO publisher (publisher_name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING publisher_id', [publisher_name]);
        if (publisherQueryResult.rows.length > 0) {
            publisherId = publisherQueryResult.rows[0].publisher_id;
        } else {
            const publisherIdQueryResult = await client.query('SELECT publisher_id FROM publisher WHERE publisher_name = $1', [publisher_name]);
            publisherId = publisherIdQueryResult.rows[0].publisher_id;
        }

        // Insert data into `category` table if it doesn't exist
        let categoryId = null;
        const categoryQueryResult = await client.query('INSERT INTO category (category_name) VALUES ($1) ON CONFLICT DO NOTHING RETURNING category_id', [category_name]);
        if (categoryQueryResult.rows.length > 0) {
            categoryId = categoryQueryResult.rows[0].category_id;
        } else {
            const categoryIdQueryResult = await client.query('SELECT category_id FROM category WHERE category_name = $1', [category_name]);
            categoryId = categoryIdQueryResult.rows[0].category_id;
        }

        // Insert data into `book` table
        const bookInsert = await client.query('INSERT INTO book (title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING book_id',
            [title, authorId, publisherId, categoryId, description, publication_year, pages, isbn, language]);
        const bookId = bookInsert.rows[0].book_id;

        // Get the current maximum copy number for the book
        const maxCopyNumberQuery = await client.query('SELECT MAX(copy_number) AS max_copy_number FROM book_copy WHERE book_id = $1', [bookId]);
        const maxCopyNumber = maxCopyNumberQuery.rows[0].max_copy_number || 0;

        // Insert data into `book_copy` table with the next copy number
        await client.query(`
            INSERT INTO book_copy (book_id, copy_number, status)
            SELECT $1, max_copy_number + row_number() OVER (), 'Available'
            FROM (
                SELECT $2 AS book_id, $3 AS max_copy_number
            ) AS max_copy
            CROSS JOIN generate_series(1, $4) AS s;
        `, [bookId, bookId, maxCopyNumber, num_copies]);

        // // Insert data into `book_copy` table with the next copy number
        // await client.query('INSERT INTO book_copy (book_id, copy_number, status) VALUES ($1, $2, $3)',
        //       [bookId, maxCopyNumber + 1, 'Available']);
        
        // Insert entry into the transaction table
        await client.query(
            'INSERT INTO transaction (copy_id, transaction_type, transaction_date) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)',
            [bookId, 'Added book', issued_by] //issued_by
        );


        res.status(200).send('Book added successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating book:', error);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

// Update book by book_id
api.put('/:book_id', async (req, res) => {
    const client = await pool.connect();


    const bookId = parseInt(req.params.book_id);
    
    const { title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language } = req.body;
    
    try {
        let result = await client.query(
            'UPDATE book SET title = $1, author_id = $2, publisher_id = $3, category_id = $4, description = $5, publication_year = $6, pages = $7, isbn = $8, language = $9  WHERE book_id = $10 RETURNING *',
          
            [title, author_id, publisher_id, category_id, description, publication_year, pages, isbn, language])
        
        // Insert entry into the transaction table
        await client.query(
            'INSERT INTO transaction (copy_id, transaction_type, transaction_date, issued_by) VALUES ($1, $2, CURRENT_TIMESTAMP, $3)',
            [bookId, 'Update', issued_by]
        );
        
        res.status(200).json(result.rows[0])
        res.status(200).json(`This user with the id: ${bookId} was updated!`)
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
});

// Delete all books with book id = $1
api.delete('/:book_id', async (req, res) => {

    const client = await pool.connect();

    const bookId = parseInt(req.params.book_id);
    const title = req.params.title;

    try {
        const bookCopiesRes = await client.query('SELECT copy_id FROM book_copy WHERE book_id = $1', [bookId]);
        const bookCopies = bookCopiesRes.rows;

        // Update the transactions
        for (const copy of bookCopies) {
            await client.query('UPDATE transactions SET transaction_type = $1 WHERE copy_id = $2', ['Canceled', copy.copy_id]);
        }

        // delete book and it's copies
        await client.query('DELETE FROM book_copy WHERE book_id = $1', [bookId]);
        await client.query('DELETE FROM book WHERE book_id = $1', [bookId]);

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
