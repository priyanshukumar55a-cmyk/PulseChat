const generateToken = require('../config/generateToken');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler (async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password, rememberMe } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id, rememberMe),
    });
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

module.exports = {
  registerUser,
  loginUser,
};