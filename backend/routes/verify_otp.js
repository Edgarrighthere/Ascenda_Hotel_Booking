const express = require('express');

const model = require('../models/user.js');

var router = express.Router();

router.post("/", async (req, res, next) => {
    const { email, otp, isDeletion } = req.body;

    try {
        const user = await model.UsersCollection.findOne({ email, otp, otpExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid OTP or OTP expired." });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpiration = undefined;

        // If it's for account deletion
        if (isDeletion) {
            await model.UsersCollection.deleteOne({ email: email });
            res.status(200).json({ 
                success: true, 
                message: "Account deleted successfully.", 
                resetUserInfo: true
            });
        } else {
            await user.save(); // Save changes after OTP verification
            res.status(200).json({ 
                success: true, 
                message: "OTP verified successfully.", 
                salutation: user.salutation, // Include salutation in response
                firstName: user.firstName, // Include first name in response
                lastName: user.lastName // Include last name in response
            });
        }

    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ success: false, message: "An error occurred. Please try again." });
    }
});

module.exports = router;