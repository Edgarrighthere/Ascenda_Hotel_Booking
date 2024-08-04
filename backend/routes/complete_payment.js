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

        const { bookingData, searchDetails, hotelDetails } = req.body;
        const bookingJSON = JSON.parse(bookingData);
        const searchJSON = JSON.parse(searchDetails);
        const hotelJSON = JSON.parse(hotelDetails);
        const user_email = bookingJSON.leadGuest.email;

        const newBookingEntry = new BookingEntry({
            email: user_email,
            session_id: session_id,
            bookingDetails: {
                leadGuest: {
                    firstName: bookingJSON.leadGuest.first_name,
                    lastName: bookingJSON.leadGuest.last_name,
                    email: bookingJSON.leadGuest.email,
                    phone: bookingJSON.leadGuest.phone
                },
                specialRequests: bookingJSON.specialRequests,
                roomType: bookingJSON.roomType,
                roomOnlyPrice: bookingJSON.roomOnlyPrice,
                breakfastPrice: bookingJSON.breakfastPrice,
                cancelPolicy: bookingJSON.cancelPolicy
            },
            searchDetails: {
                checkin: new Date(searchJSON.checkin),
                checkout: new Date(searchJSON.checkout),
                adults: searchJSON.adults,
                children: searchJSON.children,
                rooms: searchJSON.rooms,
                days: searchJSON.days
            },
            hotelDetails: {
                destination: hotelJSON.destination,
                address: hotelJSON.address,
                description: hotelJSON.description
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