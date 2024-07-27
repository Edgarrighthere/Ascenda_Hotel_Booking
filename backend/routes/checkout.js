const express = require('express');
const stripe = require('stripe')('sk_test_51PhBxoIrFKgjx0G021bl4qoBOmQAICRLFxBTOP6ucio9gaubuBSuqzyzVpmczIMggEB1GjI9P6U1hXhgHIm3PaKz00EDdxVm1a'); // stripe secret key 

const model = require('../models/user.js');

var router = express.Router();

router.post('/', async (req, res, next) => {
    const { hotelId, roomType, roomOnlyPrice, breakfastPrice, cancelPolicy } = req.body;

    console.log('Received data:', req.body);

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
            success_url: `http://localhost:3000/complete/{CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/hotels/${hotelId}`,  
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe Checkout Session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});


module.exports = router;