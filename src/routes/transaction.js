const transactionRouter = require("express").Router();
const transactionController = require("../controllers/transactionController");
const passport = require("../middleware/passport")();
transactionRouter.get(
  "/transactions",
  passport.authenticate(),
  transactionController.getAll
);
transactionRouter.get(
  "/transactions/:id",
  passport.authenticate(),
  transactionController.getTransActionByid
);
transactionRouter.post(
  "/transactions",
  passport.authenticate(),
  transactionController.createTransaction
);
transactionRouter.put(
  "/transactions/:id",
  passport.authenticate(),
  transactionController.updateTransactionbyId
);
transactionRouter.delete(
  "/transactions/:id",
  passport.authenticate(),
  transactionController.deleteByid
);
module.exports = transactionRouter;
