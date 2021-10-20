const Joi = require("joi");
// Joi validation for adding fruits request
exports.validate = (fruit) => {
  const schema = Joi.object({
    // name of fruit should be a string of minimum 5 and maximum 15 characters and it is required
    name: Joi.string().min(5).max(15).required(),
    // quauntity of fruit can be minimum 0
    quantity: Joi.number().integer().min(0),
    // price of fruit can be minimum 0
    price: Joi.number().min(0),
  });

  return schema.validate(fruit);
};
