const Joi = require('joi');

exports.validate = (fruit) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(15).required(),
        quantity: Joi.number().min(0),
        price: Joi.number().min(0),
    });
    
    return schema.validate(fruit);
}

exports.validators = [
    {
      validator: function (name) {
        let re = /strawberry|banana/i;
        return re.test(name);
      },
      msg: "Invalid Fruit Name: Should be Strawberry or Banana",
    },
    {
      validator: async function (name) {
        const fruit = await Fruit.find({ name });
  
        return !fruit.length;
      },
      msg: "Fruit already exists",
    },
];
