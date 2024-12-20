const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.header = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        msg: "Session Expired",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      msg: "Not authorized, no token",
    });
  }
};

module.exports = protect;
