// TODO
// Restructuring

const express = require("express");
const fruits = require("./routes/fruits");
const transactions = require("./routes/transactions");
const auth = require("./routes/auth");
require("./startup/db")();

require("./startup/config")();

const app = express();

app.use(express.json());
app.use("/api/fruits", fruits);
app.use("/api/transactions", transactions);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
