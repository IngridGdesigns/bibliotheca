require('dotenv').config() //to use process.env
const express = require('express');
const bodyParser = require('body-parser') //parsing body
const cors = require('cors') //cors
const helmet = require('helmet');// security middleware
const morgan = require('morgan');//HTTP request logger middleware, generates logs for API request
const app = express();
const cookieParser = require('cookie-parser')
// const database = require('./models/books');  //testing new routes
const { messagesRouter } = require("./messages/messages.router");
const { errorHandler } = require("./middleware/error.middleware");
const { notFoundHandler } = require("./middleware/not-found.middleware");
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer'); // AUTH0
// const apiRouter = express.Router();

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

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

// (function test() {
//   console.log( arguments.callee === test ); // true
// })();

// app.get('/cors', (req, res) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.send({ "msg": "This has CORS enabled 🎈" })
// })

app.get('/hello', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API, dont know if it will work' })
})


// // // Read all library staff members
app.get('/', (req, res) => {
  console.log('welcome home');
  res.json('hello and welcome to home for now')
});

const checkJwt = auth({
    audience: `${AUTH0_AUDIENCE}`,
    issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256'
});

const checkScopes = requiredScopes('read:messages, read:users, post:users, create:users');

// Import - Set up all API routes
// const adminRoute = require('./routes/adminRoute');
const authorRoutes = require('./routes/authorRoutes')
const bookRoutes = require('./routes/bookRoutes')
const bookCopyRoutes = require('./routes/bookCopyRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
// const fineRoutes = require('./routes/finesRoutes') ->  need to debug
const holdRoutes = require('./routes/holdsRoutes')
const libraryAccountRoutes = require('./routes/libraryAccountRoutes')
const libraryStaff = require('./routes/libraryStaffRoutes')
const publisherRoutes = require('./routes/publisherRoutes')
const reportRoutes = require('./routes/reportRoutes')
const transactionRoutes = require('./routes/transactionsRoutes')
const userRoutes = require('./routes/userRoutes')
// const searchRoutes = require('./routes/searchRoute');

// // Use all API routes
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/book-copies', bookCopyRoutes);
app.use('/api/category', categoryRoutes);
// app.use('/api/fines', fineRoutes); -->  need to debug
app.use('/api/holds', holdRoutes);
app.use('/api/membership-accounts', libraryAccountRoutes);
app.use('/api/staff', libraryStaff);
app.use('/api/publishers', publisherRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/books/search', searchRoutes);


app.get("/api/external", (req, res) => {
  res.send({
    msg: "Your access token was successfully validated! when you pinged",
  });
});
app.use(errorHandler);
app.use(notFoundHandler);

// app.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })


// app.use("/authors", authorRoutes);
// app.use('/api/authors', authorRoutes);

// apiRouter.use("/messages", messagesRouter);


// app.get('/api/private-scoped', checkJwt, (req, res) => {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//   });
// });

 // This route doesn't need authentication
// app.get('/api/public', (req, res) => {
//   res.json({
//     message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
//   });
// });


// // This route needs authentication
// app.get('/api/protected-site', checkJwt, (req, res) => {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated to see this.'
//   });
// });



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
