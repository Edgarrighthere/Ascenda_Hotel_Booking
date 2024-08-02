const express = require('express');
const stripe = require('stripe')('sk_test_51PhBxoIrFKgjx0G021bl4qoBOmQAICRLFxBTOP6ucio9gaubuBSuqzyzVpmczIMggEB1GjI9P6U1hXhgHIm3PaKz00EDdxVm1a'); // stripe secret key 

const model = require('../models/user.js');
const Booking = require('../models/bookingsPerUser');


var router = express.Router();

router.get('/', async (req, res, next) => {
    const result = Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
        stripe.checkout.sessions.listLineItems(req.query.session_id)
    ])

    console.log(JSON.stringify(await result))

    res.send('Your payment has been completed!')
})

router.post('/:session_id', async (req, res, next) => {
        try {
            const session_id = req.params.session_id
            const {bookingData}  = req.body;
            const bookingJSON = JSON.parse(bookingData)
            const user_email = bookingJSON.leadGuest.email

            // Find the user by email
            const user = await User.findOne({ user_email });
    
            if (user) {
                // Create a new booking
                const newBooking = new Booking({
                    user: user._id,
                    bookingDetails: bookingData,
                    searchDetails: searchData
                });
    
                await newBooking.save();
                user.accountBookings.push(newBooking._id);
                await user.save();
    
                res.status(201).json({ message: 'Booking added successfully', booking: newBooking });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error handling booking:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });




module.exports = router;