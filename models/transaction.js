const mongoose = require('mongoose');
// const Joi = require('joi');

const transactionSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    clientId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    fruitInfo: [
        {name: String, quantity: Number}
    ]
});

const Transaction = new mongoose.model('Transaction', transactionSchema);

exports.transactionSchema = transactionSchema;
exports.Transaction = Transaction;