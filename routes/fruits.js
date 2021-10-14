const express = require("express");
const mongoose = require("mongoose");
const { fruitSchema, Fruit, validateFruit } = require("../models/fruit");

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
router.post("/", async (req, res) => {
  const { error } = validateFruit(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let fruit = new Fruit({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name.toLowerCase(),
      quantity: req.body.quantity,
      price: req.body.price,
    });
    fruit = await fruit.save();

    res.send(fruit);
  } catch (err) {
    res.send(err.message);
  }
});

// TODO
// Handling exceptions
// Authentication
// Autherization
router.put("/updatefruit", async (req, res) => {
  const { error } = validateFruit(req.body);
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
