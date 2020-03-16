const express = require("express");
const app = express();
const bodyparse = require("body-parser");
app.use(bodyparse.json());
app.get("/", (req, res) => {
  res.status(200).send();
});
app.get("/users", (req, res) => {
  const users = [{ name: "Jhon Doe", email: "jho@email.com" }];
  res.status(200).json(users);
});
app.post("/users", (req, res) => {
  res.status(201).json(req.body);
});
module.exports = app;
