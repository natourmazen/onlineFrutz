const express = require("express");
const mongoose = require("mongoose");
const { Fruit } = require("../models/fruit");
const fruitController = require("../controllers/fruitController");
const login = require("../middleware/login");
const shopOwner = require("../middleware/shopOwner");

const router = express.Router();

// return all the fruits
router.get("/", async (req, res) => {
  res.send(
    // get all fruits from the database
    await Fruit.find().sort("-name")
  );
});

// return fruit based on the requested name
router.get("/:name", async (req, res) => {
  res.send(
    // get the desired fruit by name
    await Fruit.find({ name: req.params.name.toLowerCase() })
    );

});

// Create a fruit if authorized
// Using login middleware to check if logged in
// Using shopOwner middleware to check if the user is a shop Owner
router.post("/", [login, shopOwner], async (req, res) => {
  // Validating request body based on fruitController validate
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
    // Save the created fruit
    fruit = await fruit.save();
    // Send the fruit
    res.send(fruit);

    // Catching exceptions if any occurred
  } catch (exception) {
    res.send(exception.message);
  }
});

// Update (quantity or price) of a specific fruit if authorized
// Using login middleware to check if logged in
// Using shopOwner middleware to check if the user is a shop Owner
router.put("/updatefruit", [login, shopOwner], async (req, res) => {
  // Validating request body based on fruitController validate
  const { error } = fruitController.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the provided fruit name in body is valid
  const fruitName = req.body.name.toLowerCase();
  let fruit = await Fruit.find({ name: fruitName });
  if (!fruit) return res.status(400).send("Invalid fruit");

  // get the quantity from body if not given set to zero
  // get the price from the body if not given keep it the same
  let quantity = req.body.quantity ? req.body.quantity : 0;
  let price = req.body.price ? req.body.price : fruit[0].price;

  // update fruit
  await Fruit.updateOne(
    { name: fruitName },
    { 
      // Increment the quantity by the provided quantity
      quantity: fruit[0].quantity + quantity,
      // set price to new price
      price
    }
  );
  
  // send the old fruit (before update)
  res.send(fruit);
});

module.exports = router;
