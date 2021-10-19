const express = require("express");

const fruits = require("../routes/fruits");
const transactions = require("../routes/transactions");
const login = require("../routes/login");
const user = require("../routes/users");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/fruits", fruits);
  app.use("/api/transactions", transactions);
  app.use("/api/login", login);
  app.use("/api/users", user);
};
