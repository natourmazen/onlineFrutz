const { validate } = require("../../../controllers/fruitController");

const fruitGenerate = (name, quantity, price) => {
  return { name, quantity, price };
};

describe("fruitController.validate", () => {
  // name
  it("should send an error if name is not a string", () => {
    const fruit = fruitGenerate(1);
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name is less than 5 characters", () => {
    const fruit = fruitGenerate("Stra");
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name is more than 15 characters", () => {
    const fruit = fruitGenerate("0123456789123456");
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name is more than 15 characters", () => {
    const fruit = fruitGenerate();
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  // quantity
  it("should send an error if qunatity is not a number", () => {
    const fruit = fruitGenerate("Strawberry", "s");
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if qunatity is not an integer", () => {
    const fruit = fruitGenerate("Strawberry", 1.5);
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if qunatity is not a positive integer", () => {
    const fruit = fruitGenerate("Strawberry", -1);
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  // price
  it("should send an error if price is not a number", () => {
    const fruit = fruitGenerate("Strawberry", (price = "s"));
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if price is not a positive number", () => {
    const fruit = fruitGenerate("Strawberry", (price = -1));
    const validation = validate(fruit);
    expect(validation).toHaveProperty("error");
  });

  // valid request
  it("should pass if name, quantity, and price are valid", () => {
    const fruit = fruitGenerate("Strawberry", 10, 2);
    const validation = validate(fruit);
    expect(validation).not.toHaveProperty("error");
  });
});
