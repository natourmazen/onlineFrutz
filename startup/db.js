const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/onlineFrutz")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.log("Could not connect to MongoDB..."));
};
