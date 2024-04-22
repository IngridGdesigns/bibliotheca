const express = require('express');
let api = express.Router(); //to create modular mountable route handlers

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


// CREATE TABLE users (
//     member_id integer DEFAULT nextval('library_member_member_id_seq'::regclass) PRIMARY KEY,
//     name character varying(50) NOT NULL,
//     email character varying(30) NOT NULL UNIQUE,
//     password character varying(30),
//     role character varying(50) NOT NULL
// );

/********************************
        Users table CRUD 
********************************/

// Gets all users table 
api.get('/users', async(req, res) => {
   
    const client = await pool.connect();
    
    client.query('SELECT * FROM users', (err, results) => {
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

// get user by id
api.get('/users/:id', async (req, res) => {
    const client = await pool.connect();

    let id = parseInt(req.params.id);

    await client.query('SELECT * FROM users WHERE member_id =$1', [id], (err, result) => {
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

// add new user
api.post('/users', async (req, res) => {
    const client = await pool.connect();

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password; // needs encryption
    let role = req.body.role;

    await client.query('INSERT INTO USERS(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *',
        [name, email, password, role], (err, result) => {
            if (err) {
                res.status(500).send('Server error')
                client.release()
            } else {
                res.status(200).json(reuslt.rows[0])
                client.release()
            }
    })
})

// update user by id
api.put('/users/:member_id', async (req, res) => {
    const client = await pool.connect();
    const memberId = parseInt(req.params.member_id);
    const { name, email, password, role } = req.body;

    try {
        let res = await client.query(
            'UPDATE users SET username = $1, email = $2, password = $3, role = $4 WHERE member_id = $5 RETURNING *',
            [name, email, password, role, memberId])
            res.status(200).json(`This user with the id: ${memberId} was updated!`)
    } catch (err) {
        res.status(500).send(err);
    } finally {
        client.release()
    }
})

// delete by user member id
api.delete('/users/:member_id', async (req, res) => {
    const client = await pool.connect();
    const memberId = parseInt(req.params.member_id);
    const name = req.params.name;


    await client.query(
            'DELETE users WHERE member_id = $1', [memberId], (err, results) => {
         if(err){
           console.log('Oh noes you have an error!!')
           res.status(500).send('There is a server error')
           client.release()
       }
       else {
           console.log(`User:${name} - ${memberId} was succesfully deleted`)
           res.status(200).end()
           client.release()
       }
   })
})



module.exports = api;
