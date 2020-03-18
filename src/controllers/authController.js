const bcrypt = require("../utils/bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/index").user;
const privateKey = "secret";

exports.signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      raw: true
    });
    if (!user) {
      const error = new Error("Usuário ou senha errados");
      error.status = 400;
      throw error;
    }
    const passCorrect = await bcrypt.verifyPass(
      req.body.password,
      user.password
    );
    if (passCorrect) {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      const token = jwt.sign(payload, privateKey);
      res.status(200).json({ token });
    } else {
      const error = new Error("Usuário ou senha errados");
      error.status = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
exports.signUp = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      const error = new Error("Campos obrigatórios não preenchidos");
      error.status = 400;
      throw error;
    }
    const usersDb = await User.findOne({
      raw: true,
      where: { email: req.body.email }
    });
    if (usersDb) {
      const error = new Error("Usuário já existente");
      error.status = 400;
      throw error;
    } else {
      var password = await bcrypt.hashPassword(req.body.password);
      var users = await User.create({ ...req.body, password });
      delete users.dataValues.password;
      return res.status(201).json(users);
    }
  } catch (error) {
    next(error);
  }
};
