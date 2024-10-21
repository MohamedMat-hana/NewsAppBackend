const User = require("../models/UserModel");
const mailer = require("../utils/Mailler");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    // Check if user already exists
    if (userExists) {
      if (userExists.active) {
        return res.status(400).json({
          success: false,
          msg: "User already exists",
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: "Account exists but needs to be activated",
        });
      }
    }

    const user = new User({
      name,
      email,
      password,
    });

    crypto.randomBytes(20, async function (err, buf) {
      if (err) return next(err);
    
      user.activeToken = user._id + buf.toString("hex");
      user.activeExpires = Date.now() + 24 * 3600 * 1000;
    
      const link =
        process.env.NODE_ENV === "development"
          ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}`
          : `${process.env.api_host}/api/users/active/${user.activeToken}`;
    
          mailer.send({
            to: req.body.email,
            subject: "Welcome",
            html: `Please click <a href="${link}"> here </a> to activate your account.`
          });
          
      try {
        await user.save(); // Now using await for saving
        res.status(201).json({
          success: true,
          msg:
            "The activation email has been sent to " +
            user.email +
            ", please click the activation link within 24 hours",
        });
      } catch (err) {
        return next(err);
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Server having some issues",
    });
  }
};

module.exports = {
  registerUser,
};
