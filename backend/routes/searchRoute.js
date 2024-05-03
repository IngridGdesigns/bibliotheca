const express = require('express');
const { searchWithPartialmatch} = require('../models/search')

const router = express.Router();

// Get partial match - book search bar
// http://localhost:3001/api/search?term=free <-- example url
router.get('/', searchWithPartialmatch); 

// Get exact match - book search bar
// router.get('/', searchTermExactMatch);

module.exports = router;