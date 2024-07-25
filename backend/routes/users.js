var express = require('express');
var router = express.Router();
const User = require('../models/user'); // Ensure you have the correct path to your User model

// Handle GET requests to /account
router.get('/', async (req, res, next) => {
    try {
        // Assuming user ID is passed as a query parameter or from a session
        const userId = req.query.userId || req.session.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({
            salutation: user.salutation,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber
        });
    } catch (err) {
        next(err);
    }
});

// Handle DELETE requests to /account
router.delete('/', async (req, res, next) => {
    try {
        const userId = req.query.userId || req.session.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "Account deleted successfully." });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
