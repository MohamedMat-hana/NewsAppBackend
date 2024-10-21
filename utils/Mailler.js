var _ = require("lodash");
const nodemailer = require("nodemailer");

// Configuration (credentials should be stored in environment variables)
var config = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: "mathanamohamed9@gmail.com", // Use environment variables
    pass: "1942001Mm", // Use environment variables
  },
};

// Create the transporter
var transporter = nodemailer.createTransport(config);

// Default mail object (this can include default from, etc.)
var defaultMail = {
  from: "mathanamohamed9@gmail.com", // Default from address
  text: "This is a test email",  // Default text body
};

// Send function
const send = (to, subject, html) => {
  const mail = _.merge({}, defaultMail, { to, subject, html });
  transporter.sendMail(mail, function (error, info) {
    if (error) {
      return console.log("Error sending mail:", error);
    }
    console.log("Mail sent:", info.response);
  });
};

// Export the send function
module.exports = {
  send,
};
