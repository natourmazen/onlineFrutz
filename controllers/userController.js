const Joi = require("joi");

exports.validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phoneNumber: Joi.string().min(4).max(15),
    password: Joi.string().min(8).max(64).required(),
    isShopOwner: Joi.boolean(),
  });

  return schema.validate(user);
};
