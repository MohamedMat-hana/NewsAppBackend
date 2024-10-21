const User = require("../models/UserModel");
const mailer = require("../utils/Mailler");
const crypto = require("crypto");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

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

    // Create a new user if they don't exist
    const user = new User({
      name,
      email,
      password,
    });

    crypto.randomBytes(20, async (err, buf) => {
      if (err) {
        return res.status(500).json({
          success: false,
          msg: "Error generating activation token",
        });
      }

      user.activeToken = user._id + buf.toString("hex");
      user.activeExpires = Date.now() + 24 * 3600 * 1000;

      const link =
        process.env.NODE_ENV == "development"
          ? `http://localhost:${process.env.PORT}/api/users/activate/${user.activeToken}`
          : `${process.env.api_host}/api/users/activate/${user.activeToken}`;

      // Send activation email
      try {
        await mailer.send({
          to: email,
          subject: "Welcome",
          html: `Please click <a href="${link}">here</a> to activate your account.`,
        });
      } catch (mailError) {
        return res.status(500).json({
          success: false,
          msg: "Error sending activation email",
        });
      }

      // Save user
      try {
        await user.save();
        return res.status(201).json({
          success: true,
          msg: "User registered. Activation email sent.",
        });
      } catch (saveError) {
        return res.status(500).json({
          success: false,
          msg: "Error saving user",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Server having some issues",
    });
  }
}

module.exports = {
  registerUser,
};
