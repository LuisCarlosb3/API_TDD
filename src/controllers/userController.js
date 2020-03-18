const User = require("../../models/index").user;
const bcrypt = require("../utils/bcrypt");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      raw: true,
      attributes: ["id", "name", "email"]
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
exports.createUser = async (req, res, next) => {
  try {
    // console.log(req.body.name);
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
