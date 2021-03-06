const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const loginController = require("../controllers/loginController");

const router = express.Router();

router.post("/", async (req, res) => {
  // Validating request body
  const { error } = loginController.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user;
  try {
  // Checking if email is valid
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password.");
  }
  catch(exception){
    return res.status(500).send(exception.message);
  }

  // Checking if password matches the email's one
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // Sending user's authentication token
  return res.send(user.generateAuthToken());
});

module.exports = router;
