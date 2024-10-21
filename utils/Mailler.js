var _ = require('lodash');
var nodemailer = require('nodemailer');

var config = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'mathanamohamed9@gmail.com',
    pass: '1942001Mm'
  }
};

var transporter = nodemailer.createTransport(config);

var defaultMail = {
  from: 'mathanamohamed9@gmail.com',
  text: 'test test',
};

const send = ({ to, subject, html }) => {
  // Merge default options with the actual email details
  const mailOptions = {
    ...defaultMail, // Defaults like 'from'
    to,             // Destination email
    subject,        // Email subject
    html            // Email HTML content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error sending mail:", error);
    }
    console.log('Mail sent:', info.response);
  });
};

module.exports = {
  send
};
