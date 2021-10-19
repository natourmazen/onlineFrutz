const mongoose = require("mongoose");
const fruitController = require('../controllers/fruitController');

const fruitSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 15,
    unique: true,
    validate: fruitController.validators,
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
  Fruit
};
