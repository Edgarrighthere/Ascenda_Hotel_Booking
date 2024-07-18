const express = require('express');
const crypto = require('crypto');

const model = require('../models/user.js');
const emailer = require("../controllers/emailer.js");

var router = express.Router();

router.post('/', async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await model.UsersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email. Please try again.' });
        }

        // Generate reset password token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send reset password email
        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
        const mailOptions = {
            from: 'escc2g4@gmail.com',
            to: user.email,
            subject: 'Reset Password',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await emailer.transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Check your email for instructions to reset your password.' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Invalid email. Please try again.' });
    }
});

module.exports = router;