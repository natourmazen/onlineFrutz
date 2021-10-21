const { validate } = require("../../../controllers/loginController");

const loginGenerate = (email, password) => {
  return { email, password };
};

describe("loginController.validate", () => {
  // email
  it("should send an error if email is not a string", () => {
    const login = loginGenerate(1);
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is less than 5 characters", () => {
    const login = loginGenerate("1234");
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is more than 255 characters", () => {
    let email = new Array(257).join("a");
    const login = loginGenerate(email);
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is not provided", () => {
    const login = loginGenerate();
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if email is not valid", () => {
    const login = loginGenerate("example");
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  // password
  it("should send an error if password is not a string", () => {
    const login = loginGenerate("example@example.com", 1);
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if password is less than 8 characters", () => {
    const login = loginGenerate("example@example.com", "1234567");
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if password is more than 64 characters", () => {
    let password = new Array(66).join("a");
    const login = loginGenerate("example@example.com", password);
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  it("should send an error if password is not provided", () => {
    const login = loginGenerate("example@example.com");
    const validation = validate(login);
    expect(validation).toHaveProperty("error");
  });

  // valid request
  it("should pass if email and password are valid", () => {
    const login = loginGenerate("example@example.com", "12345678");
    const validation = validate(login);
    expect(validation).not.toHaveProperty("error");
  });
});
