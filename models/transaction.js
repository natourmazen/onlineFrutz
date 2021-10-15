const mongoose = require("mongoose");
// const Joi = require('joi');

const transactionSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userId: String,
  fruitInfo: [{ name: String, quantity: Number }],
  totalPrice: Number,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Transaction = new mongoose.model("Transaction", transactionSchema);

module.exports = {
  transactionSchema,
  Transaction,
};
