'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '', // generated ethereal user
        pass: '' // generated ethereal password
    }
});

const common = {};

common.isValidEmail = function(email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}

common.getNextSequence = function(db, name, callback) {
    db.collection("counters").findAndModify({ _id: name }, null, { $inc: { seq: 1 } }, function(err, result) {
        if (err) callback(err, result);
        callback(err, result.value.seq);
    });
}

common.sendMail = function(template) {
    let mailOptions = {
        from: template.from, // sender address
        to: template.emails, // list of receivers
        subject: template.subject, // Subject line
        html: template.html // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        // Preview only available when sending through an Ethereal account
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

module.exports = common;