const Joi = require("joi");

exports.validate = (transaction) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
  });

  return schema.validate(transaction);
};
