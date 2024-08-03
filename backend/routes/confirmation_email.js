// routes/confirmationEmail.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const emailer = require("../controllers/emailer.js"); // Adjust the path as necessary

router.post('/', async (req, res) => {
    const { email, bookingDetails } = req.body;

    const mailOptions = {
        from: 'escc2g4@gmail.com',
        to: email,
        subject: 'Ascenda Hotel Booking Confirmation',
        text: `Your booking has been confirmed!\n\nDetails:\n${JSON.stringify(bookingDetails)}`
    };

    try {
        await emailer.transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({ error: 'Failed to send confirmation email' });
    }
});

module.exports = router;
