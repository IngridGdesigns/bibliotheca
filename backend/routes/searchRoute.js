const express = require('express');
const { searchTermExactMatch, searchWithPartialmatch} = require('../models/search')

const router = express.Router();

// Get partial match - book search bar
router.get('/', searchWithPartialmatch);

// Get exact match - book search bar
router.get('/', searchTermExactMatch);

module.exports = router;