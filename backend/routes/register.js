const express = require('express');
const bcrypt = require("bcryptjs");

const model = require('../models/user.js');

var router = express.Router();

router.post('/', async (req, res, next) => {
    const { email, password, salutation, firstName, lastName, countryCode, phoneNumber } = req.body;

    try {
        const existingUser = await model.UsersCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Please log in." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new model.UsersCollection({
            email,
            password: hashedPassword,
            salutation,
            firstName,
            lastName,
            countryCode,
            phoneNumber
        });

        await newUser.save();
        res.status(201).json({ message: "User successfully created. Please log in." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
});

module.exports = router;