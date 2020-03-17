const Account = require("../../models/index").account;
exports.createPost = async (req, res, next) => {
  try {
    if (!req.body.name) {
      const error = new Error("Campos obrigatórios não preenchidos");
      error.status = 400;
      throw error;
    }
    const newAccounts = await Account.create(req.body);
    res.status(201).json(newAccounts);
  } catch (error) {
    next(error);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const accounts = await Account.findAll({ raw: true });
    res.status(200).json(accounts);
  } catch (error) {
    next(error);
  }
};
exports.getAccountByid = async (req, res, next) => {
  try {
    const account = await Account.findOne({
      raw: true,
      where: { id: req.params.id }
    });
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};
exports.updatedAccountByid = async (req, res, next) => {
  try {
    if (!req.body.name) {
      const error = new Error("Campos obrigatórios não preenchidos");
      error.status = 400;
      throw error;
    }
    const response = await Account.update(
      { name: req.body.name },
      { where: { id: req.params.id } }
    );
    res.status(200).json(response[0]);
  } catch (error) {
    next(error);
  }
};
exports.deleteAccountByid = async (req, res, next) => {
  try {
    let response;
    response = await Account.destroy({
      where: { id: req.params.id }
    });
    res.status(204).json(response);
  } catch (error) {
    next(error);
  }
};
