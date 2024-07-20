const express = require('express');
const stripe = require('stripe')('sk_test_51PcmhS2Ndp6I7VS5Sw6LzcvJRCOczmkkOEM0abB9jco8Ksl7Uks2AKfxSyNXI6zc21F5rajM4lUZ7eTELMNhLUWS00631Odc3k'); // stripe secret key 

const model = require('../models/user.js');

var router = express.Router();

router.get('/', async (req, res, next) => {
    const result = Promise.all([
        stripe.checkout.sessions.retrieve(req.query.session_id, { expand: ['payment_intent.payment_method'] }),
        stripe.checkout.sessions.listLineItems(req.query.session_id)
    ])

    console.log(JSON.stringify(await result))

    res.send('Your payment was successful')
})


module.exports = router;