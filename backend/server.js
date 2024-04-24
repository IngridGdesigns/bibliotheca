require('dotenv').config({ debug: true }) //to use process.env
const express = require('express');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const helmet = require('helmet');// security middleware
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const app = express();

const PORT = process.env.PORT || 3001;

// // implement middleware
app.use(express.json()) // parse to json
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(helmet());

const appOrigin = { origin: `http://localhost:${appPort}`};
app.use(cors(appOrigin));

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const checkJwt = auth({
    audience: 'https://bibliothecaAPI',
    issuerBaseURL: `https://icodenow.auth0.com/`,
    tokenSigningAlg: 'RS256'
});

const checkScopes = requiredScopes('read:messages');

// // Import routes
app.use('/api/users', require('./routes/users')); //http://localhost:3001/api/users
app.use('/api/authors', require('./routes/authors'));
app.use('/api/books', require('./routes/books'));
app.use('/api/book-copies', require('./routes/copy'));
app.use('/api/publishers', require('./routes/publishers'));
app.use('/test', require('./routes/test')); //http://localhost:3001/test/info should show data

// This route doesn't need authentication
app.get('/api/public', (req, res) => {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

app.get('/profile', (req, res) => {
    console.log(req);
})

// // This route doesn't need authentication
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// This route needs authentication
app.get('/api/protected', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

app.get('/api/private-scoped', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});