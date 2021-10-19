const Joi = require("joi");
const { Fruit } = require("../models/fruit");

exports.validateFruitInfo = (fruitInfo) => {

  const schema = Joi.array().min(1).max(2).required()
                    .items({
                      name: Joi.string().regex(/strawberry|banana/i).required(),
                      quantity: Joi.number().min(1).max(2).required()
                    });

  return schema.validate(fruitInfo);
};

exports.validateQuantity = async (fruit) => {
  let fruitInStock = await Fruit.findOne({ name: fruit.name.toLowerCase() });
  if (fruit.quantity > fruitInStock.quantity)
    return true;
}