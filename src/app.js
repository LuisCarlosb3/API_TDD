const express = require("express");
const app = express();
const bodyparse = require("body-parser");
const userRouter = require("./routes/users");
const accountsRouter = require("./routes/accounts");
const transactionRouter = require("./routes/transaction");
const authRouter = require("./routes/auth");
const passport = require("../src/middleware/passport")();
app.use(bodyparse.json());
app.use(passport.initialize());
app.use(userRouter);
app.use(authRouter);
app.use(accountsRouter);
app.use(transactionRouter);
app.get("/", (req, res) => {
  res.status(200).send();
});
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({ error: message });
});
module.exports = app;
