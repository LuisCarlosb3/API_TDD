const authRouter = require("express").Router();
const authController = require("../controllers/authController");
authRouter.post("/auth/signin", authController.signIn);
authRouter.post("/auth/signup", authController.signUp);
module.exports = authRouter;
