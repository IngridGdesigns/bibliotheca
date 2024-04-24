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


/********************************
        Holds table CRUD 
********************************/

// Gets all holds table 
api.get('/', async(req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM holds', (err, results) => {
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

// get holds by id
api.get('/:hold_id', async (req, res) => {
    const client = await pool.connect();
    let id = parseInt(req.params.hold_id);

    await client.query('SELECT * FROM holds WHERE hold_id = $1', [id], (err, result) => {
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

// add new holds
api.post('/add', async (req, res) => {
    const client = await pool.connect();

    const { book_id, member_id, hold_date, expiry_date } = req.body;

    await client.query('INSERT INTO holds (book_id, member_id, hold_date, expiry_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [book_id, member_id, hold_date, expiry_date], (err, result) => {
            if (rows.length === 0) {
            res.status(404).send('Hold not found');
        }
            
            if (err) {
                res.status(500).send('Server error')
                client.release()
            } else {
                res.status(200).json(result.rows[0])
                client.release()
            }
    })
})

// update holds by holds id
api.put('/:hold_id', async (req, res) => {
    const client = await pool.connect();
    const holdId = parseInt(req.params.hold_id);
    const { book_id, member_id, hold_date, expiry_date } = req.body;
    
    try {
        let res = await client.query(
            'UPDATE holds SET book_id = $1 member_id = $2, hold_date = $3, expiry_date = $4 WHERE hold_id = $5 RETURNING *',
            [book_id, member_id, hold_date, expiry_date, holdId])
            res.status(200).json(result.rows[0])
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
})

// delete by holds id
api.delete('/:hold_id', async (req, res) => {
    const client = await pool.connect();
    const holdsId = parseInt(req.params.hold_id);
   
    await client.query(
            'DELETE holds WHERE hold_id = $1', [holdsId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`holds:${holdsId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   })
})

module.exports = api;
