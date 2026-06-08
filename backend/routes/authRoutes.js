const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControllers");
const { body } = require("express-validator");
const authRouter = express.Router();

authRouter.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),

    body("password")
      .isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Weak password"),

    body("username").isLength({ min: 2 }).withMessage("Username too short"),
  ],
  registerUser,
);
authRouter.post("/login", loginUser);

module.exports = authRouter;
