const express = require("express");
const mongoose = require("mongoose");
const { Fruit } = require("../models/fruit");
const fruitController = require("../controllers/fruitController");
const login = require("../middleware/login");
const shopOwner = require("../middleware/shopOwner");

const router = express.Router();

// TODO
// Handling Database exceptions
router.get("/", async (req, res) => {
  let result = await Fruit.find().sort("-name");
  res.send(result);
});

// TODO
// Handling Database exceptions
router.get("/:name", async (req, res) => {
  let result = await Fruit.find({ name: req.params.name.toLowerCase() });
  res.send(result);
});

// TODO
// Handling Database exceptions
// Authentication
// Autherization
router.post("/", [login, shopOwner], async (req, res) => {
  // Validating request body
  const { error } = fruitController.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  
  try {
    // Creating a fruit with the requested body
    let fruit = new Fruit({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name.toLowerCase(),
      quantity: req.body.quantity,
      price: req.body.price,
    });
    // Saving the result in the database
    fruit = await fruit.save();
    // Sending fruit
    res.send(fruit);

    // Catching exceptions if any occurred
  } catch (exception) {
    res.send(exception.message);
  }
});

// TODO
// Handling exceptions
// Authentication
// Autherization
router.put("/updatefruit", [login, shopOwner], async (req, res) => {
  const { error } = fruitController.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const fruitName = req.body.name.toLowerCase();
  let fruit = await Fruit.find({ name: fruitName });
  if (!fruit) return res.status(400).send("Invalid fruit");

  let quantity = req.body.quantity ? req.body.quantity : 0;
  let price = req.body.price ? req.body.price : fruit[0].price;

  await Fruit.updateOne(
    { name: fruitName },
    {
      quantity: fruit[0].quantity + quantity,
      price: price,
    }
  );

  res.send(fruit);
});

module.exports = router;
