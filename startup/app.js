const express = require("express");
const app = new express();

require('./errors')();
require("./routes")(app);
require("./db")();
require("./config")();

module.exports = app;