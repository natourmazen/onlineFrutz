const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../../../startup/app");
const { User } = require("../../../models/user");
const { when } = require('jest-when');

let user1 = new User({
  name: "example",
  email: "example@example.com",
  phoneNumber: "01234567",
  password: "12345678",
  isShopOwner: true,
});

let user2 = {
  name: "example",
  email: "example@example.com",
  phoneNumber: "01234567",
  password: "12345678",
  isShopOwner: false,
};

let user3 = {
  name: "example",
  email: "example1@example.com",
  password: "12345678",
  isShopOwner: true,
};

describe("POST /api/users ", () => {
  it("should return an error if the request body is invalid", async () => {
    const response = await request(app).post("/api/users").send({});
    expect(response.statusCode).toBe(400);
  });

  it("should return an error if email is already registered", async () => {
    User.findOne = jest.fn(() => user1);
    const response = await request(app).post("/api/users").send(user2);
    expect(response.statusCode).toBe(400);
  });

  it("should return an error if a shop owner is already registered and the new request also has shop owner true", async () => {
    User.findOne = jest.fn();
    when(User.findOne)
          .calledWith({ isShopOwner: true })
          .mockReturnValue(user1);
    const response = await request(app).post("/api/users").send(user3);
    expect(response.statusCode).toBe(403);
  });

  it("should pass if the request is valid", async () => {
    User.findOne = jest.fn();
    const response = await request(app).post("/api/users").send(user2);
    expect(response.statusCode).toBe(200);
  });

  it("should pass if the request is valid", async () => {
    User.findOne = jest.fn();
    const response = await request(app).post("/api/users").send(user3);
    expect(response.statusCode).toBe(200);
  });
});
