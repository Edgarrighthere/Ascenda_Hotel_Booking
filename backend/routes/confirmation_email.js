// routes/confirmationEmail.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const emailer = require("../controllers/emailer.js"); // Adjust the path as necessary

router.post('/', async (req, res) => {
    const { email, firstName, hotelName, bookingDetails } = req.body;

    const {
        hotelId,
        roomType,
        roomOnlyPrice,
        cancelPolicy,
        destination,
        destinationId,
        checkin,
        checkout,
        guests
    } = bookingDetails;

    if ((hotelId==null) || (roomType==null) || (roomOnlyPrice==null) || (cancelPolicy==null) || (destination==null) || (destinationId==null) || (checkin==null) || (checkout==null) || (guests==null)) {
        res.status(400).json({ success: false , message: "Missing fields in booking details"});
    }

    else {

        const formattedPrice = `S$${(roomOnlyPrice / 100).toFixed(2)}`;

        const mailOptions = {
            from: 'escc2g4@gmail.com',
            to: email,
            subject: 'Ascenda Hotel Booking Confirmation',
            text: `
                Dear ${firstName},

                Your booking has been confirmed! Here are the details:

                Destination (ID): ${destination} (${destinationId})
                Hotel Name (ID): ${hotelName} (${hotelId})
                Room Type: ${roomType}
                Check-in Date: ${checkin}
                Check-out Date: ${checkout}
                Number of Guests: ${guests}
                Room Only Price: ${formattedPrice}
                Cancellation Policy: ${cancelPolicy}

                We look forward to hosting you.

                Best regards,
                Ascenda Hotel Team
            `
        };

        try {
            await emailer.transporter.sendMail(mailOptions);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            res.status(500).json({ error: 'Failed to send confirmation email' });
        }
    }
});

module.exports = router;
