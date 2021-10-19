const express = require("express");
const mongoose = require("mongoose");
const login = require("../middleware/login");
const shopOwner = require("../middleware/shopOwner");
const { transactionSchema, Transaction } = require("../models/transaction");
const transactionController = require("../controllers/transactionController");
const { Fruit } = require("../models/fruit");
const Joi = require("joi");

const router = express.Router();

// TODO ShopOwner
// Handling exceptions
// Authentication
// Autherization
// If the user is shop owner => return all transactions
// if the user is a client => return their transactions
router.get("/", login, async (req, res) => {
  // Returning transactions of all users if shop owner
  if (req.user.isShopOwner)
    return res.send(await Transaction.find().sort("-date"));

  // Returning transactions of the signed in user
  return res.send(
    await Transaction.find({ userId: req.user._id }).sort("-date")
  );
});

// TODO ShopOwner
// Handling exceptions
// Authentication
// Autherization
// If the user is shop owner => return the info
// if the user is a client => reject
router.get("/:name", [login, shopOwner], async (req, res) => {
  let result = await Transaction.find({ name: req.params.name });
  if (!result)
    return res.status(404).send("No transactions available for requested name");

  res.send(result);
});

// add quantity validation

// User 3amal login => post to buy fruits (body contains fruit info)
router.post("/", login, async (req, res) => {
  let fruitInfo = req.body.fruitInfo;
  const { error } = transactionController.validateFruitInfo(fruitInfo);
  if (error) return res.status(400).send(error.details[0].message);

  /* fruitInfo
    [
      {name: banana, quantity: 2},
      {name: strawberry, quantity: 2}
    ]
  */
  // We need to check if the quantity to buy is available
  let err = false;
  for (let fruit of fruitInfo) {
    err = await validateQuantity(fruit);
  }
  if (err) return res.status(400).send("Not enough quantity in stock");

  // We need to check if the user bought 2 of the fruit in the same day
  // Current Timestamp in milliseconds
  let currentTs = new Date().getTime();
  let yesterdayTs = currentTs - 24 * 3600000;

  // Past 24 hour transactions
  let pastTransactions = await Transaction.find({
    date: {
      $gte: new Date(yesterdayTs),
    },
    userId: req.user._id,
  });

  let strawberryBought = 0;
  let bananaBought = 0;

  pastTransactions.forEach((transaction) => {

    transaction.fruitInfo.forEach((currentFruitInfo) => {
      return currentFruitInfo.name.toLowerCase() == "strawberry"
        ? strawberryBought += currentFruitInfo.quantity
        : 0;
    });

    transaction.fruitInfo.forEach((currentFruitInfo) => {
      return currentFruitInfo.name.toLowerCase() == "banana"
        ? bananaBought += currentFruitInfo.quantity
        : 0;
    });
  });

  fruitInfo.forEach((currentFruitInfo) => {
    // For Strawberry
    if (currentFruitInfo.name.toLowerCase() == "strawberry") {
      // Result of all past quantity bought and request to buy
      let totalResult = strawberryBought + currentFruitInfo.quantity;
      if (totalResult > 2)
      err=true;
    }

    // For Banana
    if (currentFruitInfo.name.toLowerCase() == "banana") {
      // Result of all past quantity bought and request to buy
      let totalResult = bananaBought + currentFruitInfo.quantity;
      if (totalResult > 2)
        err = true;
    }
  });

  if(err){
    return res.status(400).send("You cannot buy more than 2 of the same fruit a day");
  }

  let banana = await Fruit.findOne({ name: "banana" });
  let strawberry = await Fruit.findOne({ name: "strawberry" });

  let strawberryPrice = strawberry.price;
  let bananaPrice = banana.price;

  let strawberryQuantity = 0;
  let bananaQuantity = 0;

  let totalPrice = 0;

  fruitInfo.forEach((currentFruitInfo) => {
    if (currentFruitInfo.name.toLowerCase() == "strawberry") {
      strawberryQuantity = currentFruitInfo.quantity;
      totalPrice += strawberryPrice * currentFruitInfo.quantity;
    }

    if (currentFruitInfo.name.toLowerCase() == "banana") {
      bananaQuantity = currentFruitInfo.quantity;
      totalPrice += bananaPrice * currentFruitInfo.quantity;
    }
  });

  let transaction = new Transaction({
    _id: mongoose.Types.ObjectId(),
    userId: req.user._id,
    fruitInfo: req.body.fruitInfo,
    totalPrice,
  });

  transaction = await transaction.save();

  await Fruit.updateOne(
    { name: "strawberry" },
    {
      $inc: {
        quantity: -strawberryQuantity,
      },
    }
  );
  await Fruit.updateOne(
    { name: "banana" },
    {
      $inc: {
        quantity: -bananaQuantity,
      },
    }
  );

  res.send(transaction);
});

// Check if the array length 1 or 2 DONE
// Check if strawberry or banana DONE
// Check if there is available fruits for the request
// The user can only buy 2 fruits in a day
function validateFruitInfo(fruitInfo) {
  const schema = Joi.array()
    .min(1)
    .max(2)
    .required()
    .items({
      name: Joi.string().regex("/strawberry|banana/i").required(),
      quantity: Joi.number().min(1).max(2).required(),
    });

  return schema.validate(fruitInfo);
}

async function validateQuantity(fruit) {
  let fruitInStock = await Fruit.findOne({ name: fruit.name.toLowerCase() });
  if (fruit.quantity > fruitInStock.quantity) {
    return true;
    //res.status(400).send("Not enough quantity in stock")
  }
}

module.exports = router;
