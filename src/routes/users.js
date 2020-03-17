const userRouter = require("express").Router();
const userController = require("../controllers/userController");
userRouter.get("/users", userController.getAllUsers);
userRouter.post("/users", userController.createUser);

module.exports = userRouter;
