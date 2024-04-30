require('dotenv').config({ debug: true }) //to use process.env
const express = require('express');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const helmet = require('helmet');// security middleware
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const app = express();
const cookieParser = require('cookie-parser')
const database = require('./models/books');  //testing new routes
const { messagesRouter } = require("./messages/messages.router");
const { errorHandler } = require("./middleware/error.middleware");
const { notFoundHandler } = require("./middleware/not-found.middleware");
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer'); // AUTH0
const apiRouter = express.Router();

const PORT = process.env.PORT || 3001;

const {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_CLIENT_ORIGIN_URL,
  AUTH0_AUDIENCE,
  AUTH0_DOMAIN } = process.env

if (!AUTH0_AUDIENCE || !AUTH0_CLIENT_ID || !AUTH0_CLIENT_SECRET) {
  throw new Error('Environment variables are missing!');
}

app.use(express.json()) // parse to json
app.set("json spaces", 2);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser())
app.use(cors()); // enable cors for all origins, could be modified to only one


// const pool = require('./database')// Import your PostgreSQL connection pool

app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); //set for testing
  // res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});



const checkJwt = auth({
    audience: `${AUTH0_AUDIENCE}`,
    issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256'
});

const checkScopes = requiredScopes('read:messages');


// // Import routes
// const library = require('./routes/allRoutes');
app.use("/api", apiRouter);
apiRouter.use("/messages", messagesRouter);

app.use(errorHandler);
app.use(notFoundHandler);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// app.get('/getawesome', database.getBooks);

// app.get('/api/private-scoped', checkJwt, (req, res) => {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//   });
// });

// app.use(library)

// app.get("/api/external", (req, res) => {
//   res.send({
//     msg: "Your access token was successfully validated!",
//   });
// });


// Set up all API routes
// const router = require('./routes/index');

// Use all API routes
// app.use('/api', router)


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
app.get('/api/protected-site', checkJwt, (req, res) => {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});



app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

// const appPort = 3001;
// const appOrigin = { origin: `https://localhost:${appPort}`};

// Allows FRONTEND application to make HTTP requests to Express application
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     app.use(cors(appOrigin));
//     next();
// });

// var axios = require("axios").default;
// const { ManagementClient } = require('auth0');
// const management = new ManagementClient({
//   domain: AUTH0_DOMAIN, 
//   clientId: AUTH0_CLIENT_ID,
//   clientSecret: AUTH0_CLIENT_SECRET,
// });

// console.log(management)
