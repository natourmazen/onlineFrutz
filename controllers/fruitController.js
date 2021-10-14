const Joi = require('joi');

exports.validate = (fruit) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(15).required(),
        quantity: Joi.number().min(0),
        price: Joi.number().min(0),
    });
    
    return schema.validate(fruit);
}
