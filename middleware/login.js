const jwt = require("jsonwebtoken");
const config = require("config");

// A function to authenticate the user
module.exports = function (req, res, next) {
  // Checking if token is provided
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    // Verifying the jwt
    req.user = jwt.verify(token, config.get("jwtPrivateKey"));
    next();
    // Catching exceptions if any occurred
  } catch (exception) {
    res.status(400).send("Invalid token.");
  }
};
