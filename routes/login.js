const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User, userSchema, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // Validating request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if email is valid
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // Checking if password matches the email's one
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // Sending user's authentication token
  res.send(user.generateAuthToken());
});

// Move to Controller
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
