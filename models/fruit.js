const mongoose = require("mongoose");
const Joi = require("joi");

const validators = [
  {
    validator: function (name) {
      let re = /strawberry|banana/i;
      return re.test(name);
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

function validateFruit(fruit) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(15).required(),
    quantity: Joi.number().min(0),
    price: Joi.number().min(0),
  });

  return schema.validate(fruit);
}

exports = {
  fruitSchema,
  Fruit,
  validateFruit
};
