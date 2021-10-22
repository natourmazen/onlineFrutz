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
        .regex(/\bstrawberry\b|\bbanana\b/i)
        .required(),
      quantity: Joi.number().min(1).max(2).required(),
    });

  return schema.validate(fruitInfo);
};
