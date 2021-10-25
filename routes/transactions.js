const express = require("express");
const mongoose = require("mongoose");
const login = require("../middleware/login");
const shopOwner = require("../middleware/shopOwner");
const { Transaction } = require("../models/transaction");
const transactionController = require("../controllers/transactionController");
const { validateQuantity } = require("../helperFunctions/validateQuantity");
const { Fruit } = require("../models/fruit");

const router = express.Router();

// Return Transactions based on authorization
// Using login middleware to check if logged in
router.get("/", login, async (req, res) => {
  // Returning transactions of all users if shop owner
  if (req.user.isShopOwner)
    return res.send(await Transaction.find().sort("-date"));

  // Returning transactions of the signed in user
  return res.send(
    await Transaction.find({ userId: req.user._id }).sort("-date")
  );
});

// Return transactions of a client based on id
// This call only available for the shop owner
// Using login middleware to check if logged in
// Using shopOwner middleware to check if the user is a shop Owner
router.get("/:id", [login, shopOwner], async (req, res) => {
  try {
    // Get the transactions of the requested id
    let result = await Transaction.find({ userId: req.params.id });
    // Check if the id is valid if not send status 404
    if (result.length === 0)
      return res.status(404).send("No transactions available for requested id");

    // return the result of the transactions
    return res.send(result);
  } catch (exception) {
    return res.status(500).send(exception.message);
  }
});

// Post call for the user to buy fruits
/* 
  Request Format example: {
                            "fruitInfo":[
                                          {"name": "banana", "quantity":1},
                                          {"name": "strawberry", "quantity":1}
                                        ]
                          }
*/
// Using login middleware to check if logged in
router.post("/", login, async (req, res) => {
  // Valdiating fruit Information based on validateFruitInfo
  // found in transactionController file
  let fruitInfo = req.body.fruitInfo;
  const { error } = transactionController.validateFruitInfo(fruitInfo);
  if (error) return res.status(400).send(error.details[0].message);

  // err flag set to false
  // This flag is used in order for us to be able to
  // return an error in case of any inside the array of objects
  let err = false;
  // loop over fruitInfo array and validate the quantity of each object
  for (let fruit of fruitInfo) err = await validateQuantity(fruit);

  // return an error in case of any inside the array of objects
  if (err) return res.status(400).send("Not enough quantity in stock");

  // Following code block is in order to check if
  // the user bought 2 of the fruit in the same day
  /* ---------------------------------------------------------------- */

  // current Timestamp in milliseconds
  let currentTs = new Date().getTime();
  // yesterday's Timestamp in milliseconds
  let yesterdayTs = currentTs - 24 * 3600000;

  let pastTransactions;
  try {
    // get all yesterday's and today's transactions of the logged in user
    pastTransactions = await Transaction.find({
      date: {
        $gte: new Date(yesterdayTs),
      },
      userId: req.user._id,
    });
  } catch (exception) {
    return res.status(500).send(exception.message);
  }

  // Initialize variable needed to keep track of the fruits bought
  let strawberryBought = 0;
  let bananaBought = 0;

  // loop over the past transactions and update the value of the
  // specific fruit bought
  pastTransactions.forEach((transaction) => {
    // For strawberry
    transaction.fruitInfo.forEach((currentFruitInfo) => {
      return currentFruitInfo.name.toLowerCase() == "strawberry"
        ? (strawberryBought += currentFruitInfo.quantity)
        : 0;
    });

    // For banana
    transaction.fruitInfo.forEach((currentFruitInfo) => {
      return currentFruitInfo.name.toLowerCase() == "banana"
        ? (bananaBought += currentFruitInfo.quantity)
        : 0;
    });
  });

  // loop over the requested to buy fruit information
  fruitInfo.forEach((currentFruitInfo) => {
    // for strawberry name we check if the result of the summation
    // of the already bought with the quantity to buy
    if (currentFruitInfo.name.toLowerCase() == "strawberry") {
      let totalResult = strawberryBought + currentFruitInfo.quantity;
      // set err to true if the result is more than 2
      if (totalResult > 2) err = true;
    }

    // for banana name we check if the result of the summation
    // of the already bought with the quantity to buy
    if (currentFruitInfo.name.toLowerCase() == "banana") {
      let totalResult = bananaBought + currentFruitInfo.quantity;
      // set err to true if the result is more than 2
      if (totalResult > 2) err = true;
    }
  });

  // return an error in case of attempting to buy more
  // than 2 of the same fruit the same day
  if (err) {
    return res
      .status(400)
      .send("You cannot buy more than 2 of the same fruit a day");
  }

  /* ---------------------------------------------------------------- */

  // Following code block is in order to create the transaction
  // after passing all the validations
  /* ---------------------------------------------------------------- */

  // Initializing variables to get the current price of each
  let banana, strawberry, strawberryPrice, bananaPrice;
  try {
    banana = await Fruit.findOne({ name: "banana" });
    strawberry = await Fruit.findOne({ name: "strawberry" });

    // get price of each
    strawberryPrice = strawberry.price;
    bananaPrice = banana.price;
  } catch (exception) {
    return res.status(500).send(exception.message);
  }

  // Initializing the quantity of each fruit
  let strawberryQuantity = 0;
  let bananaQuantity = 0;

  // Initializing totalPrice in order sum the total price
  let totalPrice = 0;

  // loop over the requested to buy fruit information
  fruitInfo.forEach((currentFruitInfo) => {
    // for strawberry we get the quantity to buy
    // then we multiply it by the current price
    // then add it to the total price
    if (currentFruitInfo.name.toLowerCase() == "strawberry") {
      strawberryQuantity = currentFruitInfo.quantity;
      totalPrice += strawberryPrice * currentFruitInfo.quantity;
    }
    // for banana we get the quantity to buy
    // then we multiply it by the current price
    // then add it to the total price
    if (currentFruitInfo.name.toLowerCase() == "banana") {
      bananaQuantity = currentFruitInfo.quantity;
      totalPrice += bananaPrice * currentFruitInfo.quantity;
    }
  });

  // Initialize new transaction with all the needed values
  let transaction = new Transaction({
    _id: mongoose.Types.ObjectId(),
    userId: req.user._id,
    fruitInfo: req.body.fruitInfo,
    totalPrice,
  });

  try {
    // Get connection in order to create a session for the transaction
    let connection = mongoose.connection;
    // Create session
    const session = await connection.startSession();

    // Execute Transaction contains: - saving of the transaction
    //                               - updating purchased fruit/s quantity
    await session.withTransaction(async () => {
      // save the created transaction
      transaction = await transaction.save();

      /* ---------------------------------------------------------------- */

      // Update the quantity of strawberry fruit
      await Fruit.updateOne(
        { name: "strawberry" },
        {
          $inc: {
            quantity: -strawberryQuantity,
          },
        }
      );

      // Update the quantity of banana fruit
      await Fruit.updateOne(
        { name: "banana" },
        {
          $inc: {
            quantity: -bananaQuantity,
          },
        }
      );

      // send the transaction
      return res.send(transaction);
    });

    // End Session
    session.endSession();
  } catch (exception) {
    return res.status(500).send(exception.message);
  }
});

module.exports = router;
