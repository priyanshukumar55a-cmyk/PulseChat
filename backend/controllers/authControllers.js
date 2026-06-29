const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const sendMail = require("../utils/sendEmail");

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
    pic: user.pic,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password, rememberMe } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id, rememberMe),
    });
  }

  res.status(401);
  throw new Error("Invalid email or password");
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      message: "If an account exists, a reset email has been sent.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendMail({
    email: user.email,
    subject: "Reset your PulseChat password",
    html: `
    <h2>Password Reset</h2>

    <p>Click below to reset your password:</p>

    <a href="${resetUrl}">
      Reset Password
    </a>

    <p>This link expires in 10 minutes.</p>
  `,
  });

  res.json({
    message: "Reset email sent",
  });
};

const resetPassword = async (req, res) => {
  const { password } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,

    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired token",
    });
  }

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    message: "Password updated successfully",
  });
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
