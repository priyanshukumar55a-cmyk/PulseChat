const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControllers");
const { body } = require("express-validator");
const getAllUsers = require("../controllers/userControllers");
const { protect } = require("../middlewares/authmiddleware");
const userRouter = express.Router();

userRouter.get("/",protect, getAllUsers);

module.exports = userRouter;
