const mongoose = require('mongoose');
const Joi = require('joi');

const fruitSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 15
    },
    quantity: {
        type: Number,
        min: 0,
        required: true
    },
    price: {
        type: Number,
        min: 0.0,
        required: true
    }
});

const Fruit = new mongoose.model('Fruit', fruitSchema);

function validateFruit(fruit) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(15).required(),
        quantity: Joi.number().min(0).required(),
        price: Joi.number().min(0).required()
    });

    return schema.validate(fruit);
}

exports.fruitSchema = fruitSchema;
exports.Fruit = Fruit;
exports.validateFruit = validateFruit;