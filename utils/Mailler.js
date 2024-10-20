var _ = require("lodash");
const nodemailer = require("nodemailer");

var config = {
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "mathanamohamed9@gmail.com",
    pass: "19456955s",
  },
};

var transporter = nodemailer.createTransport(config);

var defaultMail = {
  from: "mathanamohamed9@gmail.com",
  text: "testy",
};

const send = (to, subject, html) => {
  mail = _.merge({ html }, defaultMail, to);
  transporter.sendMail(mail, function (error, info) {
    if (error) return console.log(error);
    console.log("mail sent", info.response);
  });
};

module.exports = {
  send,
};
