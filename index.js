// const express = require("express");
const app = require('./startup/app');

// require('./startup/errors')();
// require("./startup/routes")(app);
// require("./startup/db")();
// require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
