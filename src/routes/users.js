const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const passport = require("../middleware/passport")();
userRouter.get("/users", passport.authenticate(), userController.getAllUsers);
userRouter.post("/users", passport.authenticate(), userController.createUser);

module.exports = userRouter;
