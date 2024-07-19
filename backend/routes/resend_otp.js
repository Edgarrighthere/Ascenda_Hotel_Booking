const express = require('express');
const crypto = require('crypto');

const model = require('../models/user.js');
const emailer = require("../controllers/emailer.js");

var router = express.Router();

router.post("/", async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await model.UsersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email." });
        }

        // Generate a new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
        await user.save();

        // Send OTP email
        const mailOptions = {
            from: 'escc2g4@gmail.com',
            to: user.email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
        };

        await emailer.transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error during OTP resend:", error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
});

module.exports = router;