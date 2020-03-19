const Account = require("../../models/index").account;
const Transaction = require("../../models/index").transaction;
const { Op } = require("sequelize");
exports.createPost = async (req, res, next) => {
  try {
    if (!req.body.name) {
      const error = new Error("Campos obrigatórios não preenchidos");
      error.status = 400;
      throw error;
    }
    const account = { ...req.body, user_id: req.user.id };
    const nameAlreadyinUse = await Account.findOne({
      where: {
        [Op.and]: [{ name: account.name }, { user_id: account.user_id }]
      }
    });
    if (nameAlreadyinUse) {
      const error = new Error("Conta já cadastrada para este usuário");
      error.status = 400;
      throw error;
    }
    const newAccounts = await Account.create(account);
    res.status(201).json(newAccounts);
  } catch (error) {
    next(error);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const accounts = await Account.findAll({
      where: { user_id: req.user.id },
      raw: true
    });
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
    const userAccount = await Account.findOne({
      where: {
        [Op.and]: [{ id: req.params.id }, { user_id: req.user.id }]
      },
      raw: true
    });

    if (!userAccount) {
      const error = new Error("Conta não registrada para usuário atual");
      error.status = 403;
      throw error;
    } else {
      const response = await Account.update(
        { name: req.body.name },
        { where: { id: req.params.id } }
      );
      res.status(200).json(response[0]);
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteAccountByid = async (req, res, next) => {
  try {
    const userAccount = await Account.findOne({
      where: {
        [Op.and]: [{ id: req.params.id }, { user_id: req.user.id }]
      },
      raw: true
    });
    if (!userAccount) {
      const error = new Error("Conta não registrada para usuário atual");
      error.status = 403;
      throw error;
    } else {
      const transaction = await Transaction.findOne({
        where: {
          account_id: req.params.id
        }
      });
      if (transaction) {
        const error = new Error("Conta possui transações registradas");
        error.status = 400;
        throw error;
      }
      let response = await Account.destroy({
        where: { id: req.params.id }
      });
      res.status(200).json(response);
    }
  } catch (error) {
    next(error);
  }
};
