const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../../../startup/app");
const { User } = require("../../../models/user");

let user1 = new User({
  name: "example",
  email: "example@example.com",
  password: "12345678",
});

const user2 = {
  email: "example@example.com",
  password: "12345678",
};

const user3 = {
  email: "example@example.com",
  password: "123456789",
};

async function encryptPassword(user) {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  return user;
}

describe("POST /api/login ", () => {
  it("should return an error if the request body is invalid", async () => {
    const response = await request(app).post("/api/login").send({});
    expect(response.statusCode).toBe(400);
  });

  it("should return an error if email does not exist in the database", async () => {
    User.findOne = jest.fn();
    const response = await request(app).post("/api/login").send(user2);
    expect(response.statusCode).toBe(400);
  });

  it("should return an error if password does not exist in the database", async () => {
    User.findOne = jest.fn().mockResolvedValue(user1);
    const response = await request(app).post("/api/login").send(user3);
    expect(response.statusCode).toBe(400);
  });

  it("should pass if email and password are valid", async () => {
    user1 = await encryptPassword(user1);
    User.findOne = jest.fn().mockResolvedValue(user1);
    const response = await request(app).post("/api/login").send(user2);
    expect(response.statusCode).toBe(200);
  });
});
