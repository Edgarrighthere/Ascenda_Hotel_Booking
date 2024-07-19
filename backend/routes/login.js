const express = require('express');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const model = require('../models/user.js');
const emailer = require("../controllers/emailer.js");

var router = express.Router();


router.post("/", async (req, res, next) => {
    const { identifier, password } = req.body;

    try {
        const user = await model.UsersCollection.findOne({email: identifier });
        if (!user) {
            return res.status(400).json({ message: "Invalid email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }

        // Generate OTP
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

        res.status(200).json({
            message: "Login successful. Verify with the OTP sent to your registered email...",
            email: user.email,
            salutation: user.salutation, // Include salutation in response
            firstName: user.firstName, // Include first name in response
            lastName: user.lastName // Include last name in response
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router;