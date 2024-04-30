const { getTransactions, createTransaction, updateTransaction } = require('../models/transactions');
const express = require('express');
const transactionRouter = express.Router();

// GET all transactions
transactionRouter.get('/', getTransactions);

// POST create transaction
transactionRouter.post('/create', createTransaction);

// PUT update transaction by ID
transactionRouter.put('/update/:transaction_id', updateTransaction);

module.exports = transactionRouter;
