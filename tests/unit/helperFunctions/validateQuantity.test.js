const {
  validateQuantity,
} = require("../../../helperFunctions/validateQuantity");
const { Fruit } = require("../../../models/fruit");

describe("validateQuantity", () => {
  beforeAll(() => {
    Fruit.findOne = jest.fn().mockResolvedValue({
      name: "strawberry",
      quantity: 1,
      price: 1,
    });
  });
  it("should return true if fruit quantity requested is greater than the quantity in stock", async () => {
    const fruit = {
      name: "strawberry",
      quantity: 2,
    };

    const result = await validateQuantity(fruit);

    expect(result).toBe(true);
  });

  it("should return false if fruit quantity requested is less than the quantity in stock", async () => {
    const fruit = {
      name: "strawberry",
      quantity: 0,
    };

    const result = await validateQuantity(fruit);

    expect(result).toBe(false);
  });
});
