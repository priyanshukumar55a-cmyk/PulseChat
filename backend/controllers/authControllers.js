require("dotenv").config();
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
  const email = req.body.email?.trim().toLowerCase();

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

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Reset your PulseChat password",
      html: `
    <div style="
      max-width:600px;
      margin:auto;
      font-family:Arial,sans-serif;
      padding:20px;
      color:#333;
    ">
      <h1 style="text-align:center;">
        PulseChat
      </h1>
  
      <h2>Password Reset Request</h2>
  
      <p>
        We received a request to reset your PulseChat password.
      </p>
  
      <p>
        Click the button below to choose a new password:
      </p>
  
      <div style="text-align:center;margin:30px 0;">
        <a
          href="${resetUrl}"
          style="
            background:#4f46e5;
            color:white;
            padding:12px 24px;
            text-decoration:none;
            border-radius:8px;
            display:inline-block;
            font-weight:bold;
          "
        >
          Reset Password
        </a>
      </div>
  
      <p>
        This link will expire in 10 minutes.
      </p>
  
      <p>
        If you didn't request a password reset,
        you can safely ignore this email.
      </p>
  
      <hr />
  
      <p style="font-size:12px;color:#666;">
        PulseChat Security Team
      </p>
    </div>
    `,
    });
  } catch (error) {
    console.error(error);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(500).json({
      message: "Email could not be sent",
    });
  }

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
