const { getTransactions, createTransaction, updateTransaction } = require('../models/transactions');
const express = require('express');
const router = express.Router();

// GET all transactions
router.get('/', getTransactions);

// POST create transaction
router.post('/create', createTransaction);

// PUT update transaction by ID
router.put('/update/:transaction_id', updateTransaction);

module.exports = router;
