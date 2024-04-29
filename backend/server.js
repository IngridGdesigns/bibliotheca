require('dotenv').config({ debug: true }) //to use process.env
const express = require('express');
// const request = require('request');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const helmet = require('helmet');// security middleware
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const app = express();
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3001;

const {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN } = process.env

if (!AUTH0_AUDIENCE || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) {
  throw new Error('Environment variables are missing!');
}

app.use(express.json()) // parse to json
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(helmet());
const appPort = 3001;
// const appOrigin = { origin: `https://localhost:${appPort}`};

app.use(cookieParser())

// Allows FRONTEND application to make HTTP requests to Express application
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     app.use(cors(appOrigin));
//     next();
// });

app.use(cors());

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
    audience: `${AUTH0_AUDIENCE}`,
    issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256'
});

const checkScopes = requiredScopes('read:messages');

// // Import routes
const library = require('./routes/allRoutes');

app.use(library)


app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});


// Set up all API routes
// const router = require('./routes/index');

// Use all API routes
// app.use('/api', router)
// app.get('/hello', (req, res) => {
//   res.json({
//     message: `hi! you are on PORT: ${PORT} and live!`
//   })
// })

// // This route doesn't need authentication
// app.get('/api/public', (req, res) => {
//   res.json({
//     message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
//   });
// });

// app.get('/profile', (req, res) => {
//     console.log(req);
// })

// // This route needs authentication
// app.get('/api/protected', checkJwt, (req, res) => {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated to see this.'
//   });
// });

// app.get('/api/private-scoped', checkJwt, (req, res) => {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//   });
// });

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});


// var axios = require("axios").default;
// const { ManagementClient } = require('auth0');
// const management = new ManagementClient({
//   domain: AUTH0_DOMAIN, 
//   clientId: AUTH0_CLIENT_ID,
//   clientSecret: AUTH0_CLIENT_SECRET,
// });

// console.log(management)
