const Transaction = require("../../models/index").transaction;
const Account = require("../../models/index").account;
// const { Op } = require("sequelize");

exports.getAll = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Account,
          as: "account",
          where: { user_id: req.user.id }
        }
      ]
    });
    return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    let transaction = req.body.newTransaction;
    if (
      !transaction.description ||
      !(transaction.type == "I" || transaction.type == "O") ||
      !transaction.date ||
      !transaction.ammout ||
      !transaction.account_id
    ) {
      const error = new Error(
        "Campos obrigatórios não preenchidos ou inválidos"
      );
      error.status = 400;
      throw error;
    }
    if (
      (transaction.type === "I" && transaction.ammout < 0) ||
      (transaction.type === "O" && transaction.ammout > 0)
    ) {
      transaction.ammout *= -1;
    }
    transaction = await Transaction.create(transaction);
    return res.status(201).json(transaction);
  } catch (error) {
    // console.log(error.message);
    next(error);
  }
};
exports.getTransActionByid = async (req, res, next) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findOne({ where: { id } });
    if (transaction) {
      return res.status(200).json(transaction);
    } else {
      const error = new Error("Transação não encontrada");
      error.status = 400;
      throw error;
    }
  } catch (error) {
    // console.log(error);
    next(error);
  }
};
exports.updateTransactionbyId = async (req, res, next) => {
  try {
    const attributes = req.body;
    const transaction = await Transaction.update(
      {
        attributes
      },
      {
        where: { id: req.params.id }
      }
    );
    res.status(200).json(transaction);
  } catch (error) {
    // console.log(error);
    next(error);
  }
};
exports.deleteByid = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findOne({
      include: [
        {
          model: Account,
          as: "account",
          where: { user_id: userId }
        }
      ],
      raw: true
    });
    if (transactions) {
      await Transaction.destroy({ where: { id: transactions.id } });
      return res.status(200).send();
    } else {
      const error = new Error("Transação nao registrada para este usuário");
      error.status = 403;
      throw error;
    }
  } catch (error) {
    // console.log(error);
    next(error);
  }
};
