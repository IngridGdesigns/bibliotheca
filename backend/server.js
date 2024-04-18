const express = require('express');
const app = express();

// TURNED OFF AUTH to test endpoints for now - WIP
// const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

const PORT = process.env.PORT || 3001;

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
// const checkJwt = auth({
//   audience: 'https://bibliothecaAPI',
//   issuerBaseURL: `https://icodenow.auth0.com/`,
//   tokenSigningAlg: 'RS256'
// });

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}, near the port`)
// })

app.get('/', async (req, res) => { //unprotected route
    res.send("testing, hello!!")
})

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

app.listen(PORT, function() {
  console.log('Listening on http://localhost:3001');
});
