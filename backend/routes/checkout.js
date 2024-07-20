const express = require('express');
const stripe = require('stripe')('sk_test_51PcmhS2Ndp6I7VS5Sw6LzcvJRCOczmkkOEM0abB9jco8Ksl7Uks2AKfxSyNXI6zc21F5rajM4lUZ7eTELMNhLUWS00631Odc3k'); // stripe secret key 

const model = require('../models/user.js');

var router = express.Router();

router.post('/', async (req, res, next) => {
    const { roomType, roomOnlyPrice, breakfastPrice, cancelPolicy } = req.body;

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
            success_url: 'http://localhost:3000/complete/{CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',  
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe Checkout Session:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});


module.exports = router;