const express = require("express");
const mongoose = require("mongoose");
const login = require("../middleware/login");
const shopOwner = require("../middleware/shopOwner");
const { transactionSchema, Transaction } = require("../models/transaction");
const transactionController = require("../controllers/transactionController");
const { Fruit } = require("../models/fruit");

const router = express.Router();

// TODO ShopOwner
// Handling exceptions
// Authentication
// Autherization
// If the user is shop owner => return all transactions
// if the user is a client => return their transactions
router.get("/", [login, shopOwner], async (req, res) => {
  let result = await Transaction
                      .find()
                      .sort("-date");

  res.send(result);
});

// TODO ShopOwner
// Handling exceptions
// Authentication
// Autherization
// If the user is shop owner => return the info
// if the user is a client => reject
router.get("/:id", login, async (req, res) => {
  let result = await Transaction.find({ id: req.params.id });
  if (!result)
    return res.status(404).send("No transactions available for requested id");

  res.send(result);
});

// add quantity validation
router.post("/", login, async (req, res) => {

  let transaction = new Transaction({
    _id: mongoose.Types.ObjectId(),
    userId: req.user._id,
    fruitInfo: req.body.fruitInfo,
    price: 5,
  });

  transaction = await transaction.save();

  await Fruit.update(
    { "fruitInfo.name": req.body.name },
    {
      $inc: {
        "fruitInfo.quantity": -req.body.quantity,
      },
    }
  );

  res.send(transaction);
});

module.exports = router;
