const Joi = require("joi");
const { Fruit } = require("../models/fruit");
// Joi validation for buying fruits
exports.validateFruitInfo = (fruitInfo) => {
  // The request will be an array of maximum 2 objects and minimum 1 and is required
  const schema = Joi.array()
    .min(1)
    .max(2)
    .required()
    .items({
      // the object consists of a name that will be either strawberry or banana, and quantity
      name: Joi.string()
        .regex(/strawberry|banana/i)
        .required(),
      quantity: Joi.number().min(1).max(2).required(),
    });

  return schema.validate(fruitInfo);
};

// To validate that we have enough fruits in stock
// We will get the quantity of fruit in stock (in the database) and compare it to the quantity of fruits in the request
exports.validateQuantity = async (fruit) => {
  let fruitInStock = await Fruit.findOne({ name: fruit.name.toLowerCase() });
  if (fruit.quantity > fruitInStock.quantity) return true;
};
