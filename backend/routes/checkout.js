const express = require('express');
const stripe = require('stripe')('sk_test_51PhBxoIrFKgjx0G021bl4qoBOmQAICRLFxBTOP6ucio9gaubuBSuqzyzVpmczIMggEB1GjI9P6U1hXhgHIm3PaKz00EDdxVm1a'); // stripe secret key 

const model = require('../models/user.js');

var router = express.Router();

router.post('/', async (req, res, next) => {
    const { hotelId, roomType, roomOnlyPrice, breakfastPrice, cancelPolicy, destinationId, destination, checkin, checkout, guests } = req.body;
    console.log("PENIS",
        hotelId,
        roomType,
        roomOnlyPrice,
        breakfastPrice,
        cancelPolicy,
        destinationId,
        destination,
        checkin,
        checkout,
        guests
    )

    const state = {
        hotelId,
        roomType,
        roomOnlyPrice,
        breakfastPrice,
        cancelPolicy,
        destinationId,
        destination,
        checkin,
        checkout,
        guests
    };


    const serializedState = encodeURIComponent(JSON.stringify(state));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'sgd',
                        product_data: {
                            name: roomType,
                            description: cancelPolicy,
                        },
                        unit_amount: roomOnlyPrice * 100, // Amount in cents
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            billing_address_collection: 'required',
            success_url: `http://localhost:3000/complete/{CHECKOUT_SESSION_ID}?state=${serializedState}`,
            cancel_url: `http://localhost:3000/hotels/${hotelId}?destinationId=${encodeURIComponent(destinationId)}&destination=${encodeURIComponent(destination)}&checkin=${encodeURIComponent(checkin)}&checkout=${encodeURIComponent(checkout)}&guests=${encodeURIComponent(guests)}&state=${serializedState}`,  
        });

        res.json({ 
            id: session.id,
            state
        });
    } catch (error) {
        console.error('Error creating Stripe Checkout Session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

module.exports = router;
