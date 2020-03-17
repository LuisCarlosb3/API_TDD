const accountsRouter = require("express").Router();
const accountsController = require("../controllers/accountController");

accountsRouter.get("/accounts", accountsController.getAll);
accountsRouter.post("/accounts", accountsController.createPost);
accountsRouter.get("/accounts/:id", accountsController.getAccountByid);
accountsRouter.put("/accounts/:id", accountsController.updatedAccountByid);
accountsRouter.delete("/accounts/:id", accountsController.deleteAccountByid);
module.exports = accountsRouter;
