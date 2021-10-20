const mongoose = require("mongoose");

const validators = [
  {
    validator: function (name) {
      let regex = /\bstrawberry\b|\bbanana\b/i;
      return regex.test(name);
    },
    msg: "Invalid Fruit Name: Should be Strawberry or Banana",
  },
  {
    validator: async function (name) {
      const fruit = await Fruit.find({ name });

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
};
