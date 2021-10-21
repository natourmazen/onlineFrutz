const login = require("../../../middleware/login");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (token) => {
  const req = {};
  req.header = jest.fn().mockReturnValue(token);
  return req;
};

describe("login middleware", () => {
  it("should return an error if token is not provided", () => {
    const res = mockResponse();
    const req = mockRequest();
    const next = jest.fn();

    login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return an error if token is not valid", () => {
    const user = {
      _id: mongoose.Types.ObjectId(),
      name: "mockUser",
      email: "mockUser@example.com",
      password: "123445678",
      isShopOwner: false,
    };

    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();

    login(req, res, next);

    expect(res.status).toBe(400);
  });
});
