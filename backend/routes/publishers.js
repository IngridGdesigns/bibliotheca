const express = require('express');
const pool = require('../database')// Import your PostgreSQL connection pool

let api = express.Router(); //to create modular mountable route handlers

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
    audience: 'https://bibliothecaAPI',
    issuerBaseURL: `https://icodenow.auth0.com/`,
    tokenSigningAlg: 'RS256'
});

const checkScopes = requiredScopes('read:messages');

// api.use(function(req, res, next) {
//     res._json = res.json;
//     res.json = function json(obj) {
//         obj.apiVersion = 1;
//         res._json(obj);
//     }
//     next();
// })

/********************************
        Publishers table CRUD 
********************************/

// Gets all publishers table 
api.get('/', async(req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM publisher', (err, results) => {
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

// get publisher by id
api.get('/:publisher_id', async (req, res) => {
    const client = await pool.connect();
    let id = parseInt(req.params.publisher_id);

  

    await client.query('SELECT * FROM publisher WHERE publisher_id = $1', [id], (err, result) => {
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

// add new publisher
api.post('/add', async (req, res) => {
    const client = await pool.connect();

    let publisher_name = req.body.publisher_name;

    await client.query('INSERT INTO publisher(publisher_name) VALUES($1) RETURNING *',
        [publisher_name], (err, result) => {
            if (err) {
                res.status(500).send('Server error')
                client.release()
            } else {
                res.status(200).json(result.rows[0])
                client.release()
            }
    })
})

// update publisher by publisher id
api.put('/:publisher_id', async (req, res) => {
    const client = await pool.connect();
    const publisherId = parseInt(req.params.publisher_id);
    
    const { publisher_name } = req.body;
    

    try {
        let res = await client.query(
            'UPDATE publisher SET publisher_name = $1 WHERE publisher_id = $5 RETURNING *',
          
            [publisher_name, publisherId])
            res.status(200).json(`This publisher with the id: ${publisherId} was updated!`)
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
})

// delete by publisher id
api.delete('/:publisher_id', async (req, res) => {
    const client = await pool.connect();
    const publisherId = parseInt(req.params.publisher_id);
    
    const { publisher_name } = req.body;


    await client.query(
            'DELETE publisher WHERE publisher_id = $1', [publisherId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`publisher:${publisher_name} - ${publisherId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   })
})

module.exports = api;
