const express = require('express');
const mongoose = require('mongoose');
const {transactionSchema, Transaction} = require('../models/transaction');

const router = express.Router();

// TODO ShopOwner
// Handling exceptions
// Authentication
// Autherization
// If the user is shop owner => return all transactions
// if the user is a client => return their transactions
router.get('/', async (req, res) => {
    let result = await Transaction
                        .find()
                        .sort('-date');

    res.send(result);
});

// TODO ShopOwner
// Handling exceptions
// Authentication
// Autherization
// If the user is shop owner => return the info
// if the user is a client => reject
router.get('/:email', async (req, res) => {
    let result = await Transaction.find({email: req.params.email});
    if (!result) return res.status(404).send('No transactions available for requested email');

    res.send(result);
});

module.exports = router;