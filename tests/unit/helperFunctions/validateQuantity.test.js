const {
  validateQuantity,
} = require("../../../helperFunctions/validateQuantity");
const { Fruit } = require("../../../models/fruit");

describe("validateQuantity", () => {
  it("should return true if fruit quantity requested is greater than the quantity in stock", () => {
    const fruit = new Fruit({
      name: "strawberry",
      quantity: 10,
      price: 3,
    });

    expect(validateQuantity(fruit)).toBeTruthy();
  });
});
