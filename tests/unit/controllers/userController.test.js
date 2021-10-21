const { validate } = require("../../../controllers/userController");

const userGenerate = (name, email, phoneNumber, password, isShopOwner) => {
  return { name, email, phoneNumber, password, isShopOwner };
};

describe("userController.validate", () => {
  // name
  it("should send an error if name is not a string", () => {
    const user = userGenerate(1);
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name is less than 2 characters", () => {
    const user = userGenerate("a");
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name is more than 255 characters", () => {
    let name = new Array(257).join("a");
    const user = userGenerate(name);
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if name is not provided", () => {
    const user = userGenerate();
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  // email
  it("should send an error if email is not a string", () => {
    const user = userGenerate("user", 1);
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is less than 5 characters", () => {
    const user = userGenerate("user", "user");
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is more than 255 characters", () => {
    let email = new Array(257).join("a");
    const user = userGenerate("user", email);
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is not provided", () => {
    const user = userGenerate("user");
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is not valid", () => {
    const user = userGenerate("user", "example");
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  // phoneNumber
  it("should send an error if phoneNumber is not a string", () => {
    const user = userGenerate("user", "example@example.com", 1);
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if phoneNumber is less than 4 numbers", () => {
    const user = userGenerate("user", "example@example.com", "123");
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if phoneNumber is more than 15 numbers", () => {
    const user = userGenerate(
      "user",
      "example@example.com",
      "01234567890123456"
    );
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  // password
  it("should send an error if password is not a string", () => {
    const user = userGenerate("user", "example@example.com", "01234567", 1);
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if password is less than 8 characters", () => {
    const user = userGenerate(
      "user",
      "example@example.com",
      "01234567",
      "1234567"
    );
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if password is more than 64 characters", () => {
    let password = new Array(66).join("a");
    const user = userGenerate(
      "user",
      "example@example.com",
      "01234567",
      password
    );
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if password is not provided", () => {
    const user = userGenerate("user", "example@example.com", "01234567");
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  // isShopOwner
  it("should send an error if isShopOwner is not boolean", () => {
    const user = userGenerate(
      "user",
      "example@example.com",
      "01234567",
      "12345678",
      1
    );
    const validation = validate(user);
    expect(validation).toHaveProperty("error");
  });

  // valid request
  it("should pass if name, email, phoneNumber, password, and isShopOwner are valid", () => {
    const user = userGenerate(
      "user",
      "example@example.com",
      "01234567",
      "12345678",
      true
    );
    const validation = validate(user);
    expect(validation).not.toHaveProperty("error");
  });
});
