const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControllers");
const { body } = require("express-validator");
const getAllUsers = require("../controllers/userControllers");
const { protect } = require("../middlewares/authmiddleware");
const userRouter = express.Router();

userRouter.get("/",protect, getAllUsers);
userRouter.get("/profile", protect, (req, res) => {
    return res.json(req.user)
});

module.exports = userRouter;
