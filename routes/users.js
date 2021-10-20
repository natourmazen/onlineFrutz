const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", async (req, res) => {
  // Validate request body
  const { error } = userController.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email is already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already registered");

  // Check if shop owner is already registered
  let shopOwner = await User.findOne({ isShopOwner: true });
  if (shopOwner && req.body.isShopOwner)
    return res.status(403).send("Shop owner already exists.");

  // Initializing variables in order to not have undefined values
  // if the request body does not have these values
  let phoneNumber = req.body.phonenumber ? req.body.phonenumber : null;
  let isShopOwner = req.body.isShopOwner ? req.body.isShopOwner : false;

  // Creating new user
  user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneNumber,
    isShopOwner,
  });

  // Hashing the password with salt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // save the created user
  await user.save();

  // Generating token for user
  const token = user.generateAuthToken();

  // sending token as a header and body
  res.header("x-auth-token", token);
  res.send(token);
});

module.exports = router;
