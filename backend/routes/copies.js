const express = require('express');
let api = express.Router(); 

api.use(function(req, res, next) {
    res._json = res.json;
    res.json = function json(obj) {
        obj.apiVersion = 1;
        res._json(obj);
    }
    next();
})

//require posgresql
const Pool = require('pg').Pool;

//Postgresql connection configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
})

pool.on('error', (error) => {
    console.error('Unexpected error on idle client', error);
    process.exit(-1); // Exit the application on error
});

// delete a copy of a book
api.delete('/copies/:copy_id', async (req, res) => {

    const client = await pool.connect();

    const bookcopy_id = parseInt(req.params.bookcopy_id);

    try {
        await client.query('DELETE FROM book_copy WHERE book_id = $1', [bookId]);

        console.log(`Book:${title} - ${bookId} was successfully deleted`);

        res.status(200).send(`Books:${title} - ${bookId} was successfully deleted`);

    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('There is a server error');
    } finally {
        client.release();
    }
});