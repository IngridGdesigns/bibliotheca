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
        Category table CRUD 
********************************/

// Gets all categories table 
api.get('/', async(req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM category', (err, results) => {
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

// get category by id
api.get('/:category_id', async (req, res) => {
    const client = await pool.connect();
    let id = parseInt(req.params.category_id);

    await client.query('SELECT * FROM category WHERE category_id = $1', [id], (err, result) => {
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

// add new category
api.post('/add', async (req, res) => {
    const client = await pool.connect();

    let category_name = req.body.category_name;

    await client.query('INSERT INTO category(category_name) VALUES($1) RETURNING *',
        [category_name], (err, result) => {
            if (err) {
                res.status(500).send('Server error')
                client.release()
            } else {
                res.status(200).json(result.rows[0])
                client.release()
            }
    })
})

// update category by category id
api.put('/:category_id', async (req, res) => {
    const client = await pool.connect();
    const categoryId = parseInt(req.params.category_id);
    
    const { category_name } = req.body;
    

    try {
        let res = await client.query(
            'UPDATE category SET category_name = $1 WHERE category_id = $5 RETURNING *',
          
            [category_name, categoryId])
            res.status(200).json(`This category with the id: ${categoryId} was updated!`)
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
})

// delete by category id
api.delete('/:category_id', async (req, res) => {
    const client = await pool.connect();
    const categoryId = parseInt(req.params.category_id);
    
    const { category_name } = req.body;


    await client.query(
            'DELETE category WHERE category_id = $1', [categoryId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`category:${category_name} - ${categoryId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   })
})

module.exports = api;
