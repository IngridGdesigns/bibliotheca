const pool = require('../database');


/********************************
        
    Search table CRUD 

********************************/
// ('/searchbooks) // 
const searchWithPartialmatch = async (req, res) => {
    const client = await pool.connect();
    const title = req.params.title;
    const searchTerm = req.query.term;

    if (!searchTerm) {
        return res.status(400).json({ error :'Uh oh Search term required!'}) 
    };

    const query = `SELECT * FROM book WHERE title LIKE $1 OR description LIKE $2`;
    

    //% TERM % <---- use to perform partial match
    const searchVal = `%${searchTerm}%`;

    client.query(query, [searchVal, searchVal], (err, results) => {
        if (err) {
            console.error(':( Error executing search query:', err);
                return res.status(500).json({error: 'Internal server error'});
            }
            res.json(results);
        });
}
// robust book search bycategory, author, book, publsiher
// SELECT b.*, a.author_name, p.publisher_name, c.category_name
// FROM book b
// LEFT JOIN authors a ON b.author_id = a.author_id
// LEFT JOIN publisher p ON b.publisher_id = p.publisher_id
// LEFT JOIN category c ON b.category_id = c.category_id
// WHERE (b.title LIKE $1 OR b.description LIKE $2)
// AND (a.author_name LIKE $3 OR c.category_name LIKE $4);

// app.get('/search', 
const searchTermExactMatch = async (req, res) => {
    const client = await pool.connect();
    const book = req.params.title;
    const searchTerm = req.query.term;
 
    if (!searchTerm) {
        return res.status(400).json({ error: 'Uh oh Search term required!' })
    };
 
    const query = 'SELECT * FROM book WHERE title LIKE ?';

    const searchVal = searchTerm;

     client.query(query, [searchVal], (err, results) => {
        if (err) {
            console.error(':( Error executing search query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
}

module.exports = {
    // searchTermExactMatch,
    searchWithPartialmatch
}

