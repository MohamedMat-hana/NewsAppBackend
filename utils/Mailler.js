var _ = require("lodash");
var nodemailer = require("nodemailer");

var config = {
  service: 'gmail',
  auth: {
    user: "mathanamohamed9@gmail.com",
    pass: "umrc zdgs vkxr stua",
  },
};

var transporter = nodemailer.createTransport(config);

var defaultMail = {
  from: "mathanamohamed9@gmail.com",
  subject: "test email",
  text: "test test",
};

const send = ({ to, subject, html }) => {
   const mailOptions = {
    ...defaultMail,  
    to, 
    subject, 
    html,  
  };

   transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending mail:", error);
    }
    console.log("Mail sent:", info.response);
  });
};

module.exports = {
  send,
};
