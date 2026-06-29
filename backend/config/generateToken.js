const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (id, rememberMe = false) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : "1d",
  });
};

module.exports = generateToken;
