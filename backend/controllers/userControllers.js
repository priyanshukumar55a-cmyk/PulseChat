const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// /api/user?search=pk
const getAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    
    res.send(users);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, pic } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //check email uniqueness if changed
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400);
      throw new Error("Email already exists");
    }
  }

  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (pic !== undefined) user.pic = pic;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    pic: updatedUser.pic,
    token: generateToken(updatedUser._id),
  });
})

module.exports = {getAllUsers, updateProfile};
