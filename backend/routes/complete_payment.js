const express = require('express');
const stripe = require('stripe')('sk_test_51PhBxoIrFKgjx0G021bl4qoBOmQAICRLFxBTOP6ucio9gaubuBSuqzyzVpmczIMggEB1GjI9P6U1hXhgHIm3PaKz00EDdxVm1a'); // stripe secret key 

const model = require('../models/user.js');
const Booking = require('../models/bookingsPerUser');
const BookingEntry = require('../models/bookingsPerUser'); 

var router = express.Router();

router.get('/', async (req, res, next) => {
    const result = Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
        stripe.checkout.sessions.listLineItems(req.query.session_id)
    ])

    console.log(JSON.stringify(await result))

    res.send('Your payment was successful')
})

router.post('/:session_id', async (req, res, next) => {
    const session_id = req.params.session_id;
    try {
        const existingBooking = await BookingEntry.findOne({ session_id: session_id });

        if (existingBooking) {
            return res.status(400).json({ message: 'Booking with this session_id already exists' });
        }

        const { email, firstName, lastName, phone, specialRequests, roomType, roomOnlyPrice, breakfastPrice, cancelPolicy, checkin, checkout, adults, children, rooms, days, destination, address, description, hotelName } = req.body;
        
        const newBookingEntry = new BookingEntry({
            email: email,
            session_id: session_id,
            bookingDetails: {
                leadGuest: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone
                },
                specialRequests: specialRequests,
                roomType: roomType,
                roomOnlyPrice: roomOnlyPrice,
                breakfastPrice: breakfastPrice,
                cancelPolicy: cancelPolicy
            },
            searchDetails: {
                checkin: new Date(checkin),
                checkout: new Date(checkout),
                adults: adults,
                children: children,
                rooms: rooms,
                days: days
            },
            hotelDetails: {
                destination: destination,
                address: address,
                description: description,
                hotelName : hotelName
            }
        });

        await newBookingEntry.save();

        res.status(201).json({ message: 'Booking entry created successfully', bookingEntry: newBookingEntry });
    } catch (error) {
        console.error('Error handling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/bookings', async (req, res, next) => {
    try {
        console.log("REACHEDBOOKINGQUERY")
        const email = req.query.email;
        if (!email) {
            return res.status(400).json({ message: 'Email query parameter is required' });
        }

        const bookings = await BookingEntry.find({ 'bookingDetails.leadGuest.email': email });

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this email' });
        }

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;