const express = require('express');
const pool = require('./db'); // Import your PostgreSQL connection pool

let api = express.api(); //to create modular mountable route handlers

api.use(function(req, res, next) {
    res._json = res.json;
    res.json = function json(obj) {
        obj.apiVersion = 1;
        res._json(obj);
    }
    next();
})

/********************************
        Authors table CRUD 
********************************/

// Gets all authors table 
api.get('/', async(req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM author', (err, results) => {
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
})

// get author by id
api.get('/:author_id', async (req, res) => {
    const client = await pool.connect();
    let id = parseInt(req.params.author_id);

  

    await client.query('SELECT * FROM author WHERE author_id = $1', [id], (err, result) => {
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

// add new author
api.post('/', async (req, res) => {
    const client = await pool.connect();

    let author_name = req.body.author_name;

    await client.query('INSERT INTO author(author_name) VALUES($1) RETURNING *',
        [author_name], (err, result) => {
            if (err) {
                res.status(500).send('Server error')
                client.release()
            } else {
                res.status(200).json(result.rows[0])
                client.release()
            }
    })
})

// update author by author id
api.put('/:author_id', async (req, res) => {
    const client = await pool.connect();
    const authorId = parseInt(req.params.author_id);
    
    const { author_name } = req.body;
    

    try {
        let res = await client.query(
            'UPDATE author SET author_name = $1 WHERE author_id = $5 RETURNING *',
          
            [author_name, authorId])
            res.status(200).json(`This author with the id: ${authorId} was updated!`)
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
})

// delete by author id
api.delete('/:author_id', async (req, res) => {
    const client = await pool.connect();
    const authorId = parseInt(req.params.author_id);
    
    const { author_name } = req.body;


    await client.query(
            'DELETE author WHERE author_id = $1', [authorId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`Author:${author_name} - ${authorId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   })
})


module.exports = api;
