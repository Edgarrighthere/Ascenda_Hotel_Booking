const express = require('express');
const bcrypt = require("bcryptjs");

const model = require('../models/user.js');

var router = express.Router();

router.post('/', async (req, res, next) => {
    const { email, password, salutation, firstName, lastName, countryCode, phoneNumber } = req.body;

    try {
        const existingUser = await model.UsersCollection.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User Email already exists. Please log in." });
        }
        const existingPhone = await model.UsersCollection.findOne({ phoneNumber });
        if (existingPhone) {
            return res.status(400).json({ message: "User Phone Number already exists. Please log in." });
        }

        // Validate phone number format
        const phoneNumberRegex = /^\d+$/;
        if (!phoneNumberRegex.test(phoneNumber)) {
            return res.status(400).json({ message: "Phone number must contain only digits." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new model.UsersCollection({
            email: email,
            password: hashedPassword,
            salutation: salutation,
            firstName: firstName,
            lastName: lastName,
            countryCode: countryCode,
            phoneNumber: phoneNumber
        });
        await newUser.save();
        res.status(201).json({ message: "User successfully created. Please log in." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router;