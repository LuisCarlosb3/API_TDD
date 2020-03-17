const express = require("express");
const app = express();
const bodyparse = require("body-parser");
const userRouter = require("./routes/users");
const accountsRouter = require("./routes/accounts");

app.use(bodyparse.json());
app.use(userRouter);
app.use(accountsRouter);
app.get("/", (req, res) => {
  res.status(200).send();
});
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({ error: message });
});
module.exports = app;
