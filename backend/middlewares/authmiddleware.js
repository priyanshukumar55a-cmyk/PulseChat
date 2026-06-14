const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        res.status(401);
        return next(new Error("Invalid token payload"));
      }

      // Helpful logging for debugging auth issues
      console.log("auth: decoded id ->", decoded.id);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.warn(`auth: no user for id ${decoded.id}`);
        res.status(401);
        return next(new Error("User not found"));
      }

      return next();
    } catch (error) {
      console.warn("auth: token verification failed", error.message);
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  }

  res.status(401);
  return next(new Error("No token provided"));
};

module.exports = { protect };
