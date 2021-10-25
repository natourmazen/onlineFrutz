const mongoose = require("mongoose");

// This custome validator validates the addition of fruits
const validators = [
  {
    // To only allow the shop owner add strawberry or banana as a fruit
    validator: function (name) {
      let regex = /\bstrawberry\b|\bbanana\b/i;
      return regex.test(name); // check if the shop owner input matches the regular expression expression
    },
    msg: "Invalid Fruit Name: Should be Strawberry or Banana",
  },
  {
    // If strawberry or banana is already added to the database, it will print a message "Fruit already exists"
    validator: async function (name) {
      const fruit = await Fruit.find({ name }); // chech if the input (strawberry or banana) exist in the database

      return !fruit.length;
    },
    msg: "Fruit already exists",
  },
];

const fruitSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15,
    unique: true,
    validate: validators,
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0,
  },
  price: {
    type: Number,
    min: 0.0,
    default: 0.0,
  },
});

const Fruit = new mongoose.model("Fruit", fruitSchema);

module.exports = {
  fruitSchema,
  Fruit,
  validators
};
