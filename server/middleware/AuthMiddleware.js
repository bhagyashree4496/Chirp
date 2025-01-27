const UserChat = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Correct method name for Mongoose
      req.user = await UserChat.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (e) {
      console.error(e.message); // Log the error for debugging
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
