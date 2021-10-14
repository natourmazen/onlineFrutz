const mongoose = require("mongoose");
// const Joi = require('joi');

const transactionSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  fruitInfo: [{ name: String, quantity: Number }],
});

const Transaction = new mongoose.model("Transaction", transactionSchema);

exports = {
  transactionSchema,
  Transaction
};

