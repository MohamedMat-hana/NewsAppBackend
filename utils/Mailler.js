var _ = require('lodash');	
var nodemailer = require('nodemailer');

var config = {
    host: 'smtp.gmail.com',
    port: 587,
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


const send = (to, subject, html) => {
    // use default setting
    mail = _.merge({html}, defaultMail, to);
    
    // send email
    transporter.sendMail(mail, function(error, info){
        if(error) return console.log(error);
        console.log('mail sent:', info.response);
    });
}
module.exports = {
    send
}