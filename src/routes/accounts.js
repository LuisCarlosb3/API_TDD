const accountsRouter = require("express").Router();
const accountsController = require("../controllers/accountController");
const passport = require("../middleware/passport")();
accountsRouter.get(
  "/accounts",
  passport.authenticate(),
  accountsController.getAll
);
accountsRouter.post(
  "/accounts",
  passport.authenticate(),
  accountsController.createPost
);
accountsRouter.get(
  "/accounts/:id",
  passport.authenticate(),
  accountsController.getAccountByid
);
accountsRouter.put(
  "/accounts/:id",
  passport.authenticate(),
  accountsController.updatedAccountByid
);
accountsRouter.delete(
  "/accounts/:id",
  passport.authenticate(),
  accountsController.deleteAccountByid
);
module.exports = accountsRouter;
