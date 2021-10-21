const { Fruit } = require("../models/fruit");
// To validate that we have enough fruits in stock
// We will get the quantity of fruit in stock (in the database)
// and compare it to the quantity of fruits in the request
exports.validateQuantity = async (fruit) => {
  let fruitInStock = await Fruit.findOne({ name: fruit.name.toLowerCase() });
  if (fruit.quantity > fruitInStock.quantity) return true;
};
