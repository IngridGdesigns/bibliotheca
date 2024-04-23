const express = require('express');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const helmet = require('helmet');// security middleware
// const pool = require('./database')// Import your PostgreSQL connection pool
// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import morgan from 'morgan';
// import helmet from 'helmet';
// import pool from './database.js'
// const { auth } = require('express-oauth2-jwt-bearer');

require('dotenv').config({ debug: true }) //to use process.env

const PORT = process.env.PORT || 3001;
// const AUDIENCE = process.env.Auth0_AUDIENCE || '';
// const DOMAIN = process.env.AUTH0_DOMAIN || '';

const app = express(); // instantiate express app

app.use(express.json()) // parse to json
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Establish routes
app.use('/api/users', require('./routes/users')); //http://localhost:3001/api/users
app.use('/api/authors', require('./routes/authors'))
app.use('/api/books', require('./routes/books'))
app.use('/api/book-copies', require('./routes/copies'))
app.use('/api/publishers', require('./routes/publishers'))
app.use('/test', require('./routes/test')) //http://localhost:3001/test/info should show data


// TURNED OFF AUTH to test endpoints for now - WIP
// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
// const checkJwt = auth({
//   audience: AUDIENCE,
//   issuerBaseURL: `https://${DOMAIN}//.well-known/jwks.json`,
//   tokenSigningAlg: 'RS256'
// });



// app.get('/', async (req, res) => { //unprotected route
//     console.log
//     res.send("Hello and welcome to Bibliotheca")
// })



// This route doesn't need authentication
// app.get('/api/public', function(req, res) {
//   res.json({
//     message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
//   });
// });

// // This route needs authentication
// app.get('/api/private', checkJwt, function(req, res) {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated to see this.'
//   });
// });

// const checkScopes = requiredScopes('read:messages');

// app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//   });
// });

// Gets the whole users table --DONE
// app.get('/api/awesome', async(req, res) => {
   
//     const client = await pool.connect();
    
//     client.query('SELECT * FROM users', (err, results) => {
//         if (err) {
//             console.log('error oh noes!!', err)
//             res.status(500).send('Server error');
//             client.release()
//         } 
//         else {
//             console.log('data fetched successfully');
//             res.status(200).json(results.rows) // res.json(dbitems.rows)
//             client.release()//closes database
//         }
//     })
// })

app.listen(PORT, () => {
    console.log(`API Server listening on ${PORT}, near the port`)
})