const express = require("express");
var router = express.Router();

/* GET hotel listing. */
router.get("/:id/:checkin/:checkout/:guests", async function (req, res, next) {
    const destinationId = req.params.id;
    const checkin = req.params.checkin;
    const checkout = req.params.checkout;
    const guests = req.params.guests;
    const api_url = "https://hotelapi.loyalty.dev/api/hotels?destination_id=" + destinationId + "&checkin=" + checkin + "&checkout=" + checkout + "&lang=en_US&currency=SGD&country_code=SG" + "&guests=" + guests + "&partner_id=1";
    console.log(api_url);

    const response = await fetch(api_url)
    const text = await response.text();
    const json = JSON.parse(text);

    res.set("Access-Control-Allow-Origin", "http://localhost:3001");
    res.send(`${JSON.stringify(json)}`);
    //res.send(`${JSON.stringify(json.slice(0, 10))}`);
});

module.exports = router;