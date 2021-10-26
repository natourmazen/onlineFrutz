let { Fruit, validators } = require("../../../models/fruit");

describe("Fruit Model validators", () => {
  it("should return validation error if fruit name does not match strawberry or banana", () => {
    let firstValidate = validators[0].validator;

    let result = firstValidate("strawberry");

    expect(result).toBeTruthy();
  });

  it("should return validation error if fruit name already exists in database", async () => {
    let secondValidate = validators[1].validator;

    jest.spyOn(Fruit, "find").mockImplementation(() => []);

    let result = secondValidate("strawberry");

    expect(result).toBeTruthy();
  });
});
