const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    minlength: 4,
    maxlength: 15,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true,
  },
  isShopOwner: {
    type: Boolean,
    default: false,
  },
  transactions: [String],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isShopOwner: this.isShopOwner
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = new mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string().min(4).max(15),
    password: Joi.string().min(8).max(64).required(),
  });

  return schema.validate(user);
}

module.exports = {
  userSchema,
  User,
  validateUser
};

