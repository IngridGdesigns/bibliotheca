const pool = require('../database')// Import your PostgreSQL connection pool

/********************************
        Authors table CRUD 
********************************/

// Gets all authors table 
const getAuthors = (request, response) => {
   
    const client = pool.connect();
    
    client.query('SELECT * FROM author', (err, results) => {
        // handleErrorOrReturnData();
        if (err) {
            console.log('error oh noes!!', err)
            response.status(500).send('Server error');
            client.release()
        }
        else {
            console.log('data fetched successfully');
            response.status(200).json(results.rows) // response.json(dbitems.rows)
            client.release()//closes database
        }
    })
}

// get author by id
const getAuthorById = (req, res) => {
    const client = pool.connect();
    let id = parseInt(req.params.author_id);

    client.query('SELECT * FROM author WHERE author_id = $1', [id], (err, result) => {
      if (err) {
          response.status(500).send(err);
          client.release()
      } 
      else { //response.json(dbitems.rows[0] )
          response.status(200).json(result.rows[0])
          client.release()
      }
    })
}

// add new author
const createAuthor = (req, response) => {
    const client = pool.connect();

    let author_name = req.body.author_name;

    client.query('INSERT INTO author(author_name) VALUES($1) RETURNING *',
        [author_name], (err, result) => {
            if (err) {
                response.status(500).send('Server error')
                client.release()
            } else {
                response.status(200).json(result.rows[0])
                client.release()
            }
    })
}

// update author by author id
const updateAuthor= (req, res) => {
    const client = pool.connect();
    
    const authorId = parseInt(req.params.author_id);
    const { author_name } = req.body;
    
    let res = client.query(
        'UPDATE author SET author_name = $1 WHERE author_id = $5 RETURNING *', [author_name, authorId], (res, res) => {
            if (error) {
                throw error;
            }
            res.status(200).json(`This author with the id: ${authorId} was updated!`)
    })  
}

// delete by author id
const deleteAuthor = (req, res) => {
    const client = pool.connect();
    const authorId = parseInt(req.params.author_id);
    
    const { author_name } = req.body;

    client.query(
            'DELETE FROM author WHERE author_id = $1', [authorId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           response.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`Author:${author_name} - ${authorId} was succesfully deleted`)
           response.status(200).end()
           client.release()
       }
   })
}


module.exports = {
        getAuthors,
        getAuthorById,
        createAuthor,
        updateAuthor,
        deleteAuthor,
}
