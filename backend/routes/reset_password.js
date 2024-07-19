const express = require('express');
const bcrypt = require("bcryptjs");

const model = require('../models/user.js');

var router = express.Router();

router.post('/:token', async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    try {
        const user = await model.UsersCollection.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const isSameAsOldPassword = await bcrypt.compare(password, user.password);
        if (isSameAsOldPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful. Redirecting to login page...' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});


module.exports = router;