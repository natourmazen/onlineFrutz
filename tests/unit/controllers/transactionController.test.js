const {
  validateFruitInfo,
} = require("../../../controllers/transactionController");

const fruitInfoGenerate = ([{ name, quantity }]) => {
  return [{ name, quantity }];
};

describe("transactionController.validateFruitInfo", () => {
  // array
  it("should send an error if request is not an array", () => {
    const validation = validateFruitInfo({ name: "strawberry", quantity: 1 });
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if the length of the array is 0", () => {
    const validation = validateFruitInfo([]);
    expect(validation).toHaveProperty("error");
  });
  it("should send an error if the length of the array is more than 2", () => {
    const validation = validateFruitInfo([{}, {}, {}]);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if an array is not provided", () => {
    const validation = validateFruitInfo();
    expect(validation).toHaveProperty("error");
  });

  // name
  it("should send an error if name is not a string", () => {
    const validation = validateFruitInfo([{ name: 1, quantity: 10 }]);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name does not match strawberry or banana", () => {
    const validation = validateFruitInfo([{ name: "straw", quantity: 10 }]);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name is not provided", () => {
    const validation = validateFruitInfo([{ quantity: 10 }]);
    expect(validation).toHaveProperty("error");
  });

  // quantity
  it("should send an error if quantity is less than 1", () => {
    const validation = validateFruitInfo([{ name: "strawberry", quantity: 0 }]);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if quantity is more than 2", () => {
    const validation = validateFruitInfo([{ name: "strawberry", quantity: 3 }]);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if quantity is not provided", () => {
    const validation = validateFruitInfo([{ name: "strawberry" }]);
    expect(validation).toHaveProperty("error");
  });

  // valid request
  it("should pass if the array, name, and quantity are valid", () => {
    const validation = validateFruitInfo([{ name: "strawberry", quantity: 1 }]);
    expect(validation).not.toHaveProperty("error");
  });

  it("should pass if the array, name, and quantity are valid", () => {
    const validation = validateFruitInfo([
      { name: "strawberry", quantity: 1 },
      { name: "banana", quantity: 1 },
    ]);
    expect(validation).not.toHaveProperty("error");
  });
});
