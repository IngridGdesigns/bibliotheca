const pool = require('../database');


/********************************
        
    Search table CRUD 

********************************/
// ('/searchbooks)
const searchWithPartialmatch = async (req, res) => {
    const client = await pool.connect();

    const searchTerm = req.query.term;

    if (!searchTerm) {
        return res.status(400).json({ error :'Uh oh Search term required!'}) 
    };

    const query = 'SELECT * FROM book WHERE title ILIKE $1 OR description ILIKE $2';

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

// app.get('/search', 
const searchTermExactMatch = (req, res) => {
    const client = pool.connect();

    const searchTerm = req.query.term;
 
    if (!searchTerm) {
        return res.status(400).json({ error: 'Uh oh Search term required!' })
    };
 
    const query = 'SELECT * FROM book WHERE title ILIKE $1';

    const searchVal = searchTerm;
    client.query(query, [searchVal, searchVal], (err, results) => {
        if (err) {
            console.error(':( Error executing search query:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
}

module.exports = {
    searchTermExactMatch,
    searchWithPartialmatch
}

