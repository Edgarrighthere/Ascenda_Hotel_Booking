const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'escc2g4@gmail.com',
        pass: 'gkgf gafp inmm zfwm'
    }
});

module.exports = {transporter};