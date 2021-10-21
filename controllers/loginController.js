const Joi = require("joi");
// Joi validation of login request
exports.validate = (request) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(64).required(),
  });

  return schema.validate(request);
};
