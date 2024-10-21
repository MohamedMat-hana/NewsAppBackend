const User = require("../models/UserModel");
const mailer = require("../utils/Mailler");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists && userExists.active) {
      return res.status(400).json({
        success: false,
        msg: "User already exists",
      });
    } else if (!userExists && !userExists.active) {
      return res.status(400).json({
        success: false,
        msg: "account is here but need to active",
      });
    }

    const user = new User({
      name,
      email,
      password,
    });

    crypto.randomBytes(20, function (err, buf) {
      user.activeToken = user._id + buf.toString("hex");

      user.activeExpires = Date.now() + 24 * 3600 * 1000;
      var link =
        process.env.NODE_ENV == "development"
          ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}`
          : `${process.env.api_host}/api/users/active/${user.activeToken}`;
      mailer.send({
        to: req.body.email,
        subject: "Welcome",
        html:
          'please click <a href="' +
          link +
          '"> here </a> to active your account. ',
      });
      user.save(function (err, user) {
        if (err) return next(err);
        res.status(201).json({
          success: true,
          msg:
            "the activation email has been sent to" +
            user.email +
            ",please click the activation link within 24 hours",
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "server having some issues",
    });
  }
};

module.exports = {
  registerUser,
};
