const Joi = require("joi");

exports.validateFruitInfo = (fruitInfo) => {
  
  const schema = Joi.array().min(1).max(2).required()
                    .items({
                      name: Joi.string().regex(/strawberry|banana/i).required(),
                      quantity: Joi.number().min(1).max(2).required()
                    });

  return schema.validate(fruitInfo);
};
