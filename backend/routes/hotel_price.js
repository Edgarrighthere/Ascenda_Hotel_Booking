const express = require("express");
var router = express.Router();

/* GET hotel listing. */
router.get("/:id/:checkin/:checkout/:guests", async function (req, res, next) {
    const destinationId = req.params.id;
    const checkin = req.params.checkin;
    const checkout = req.params.checkout;
    const guests = req.params.guests;
    var completed = false;
    const api_url = "https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=" + destinationId + "&checkin=" + checkin + "&checkout=" + checkout + "&lang=en_US&currency=SGD&country_code=SG" + "&guests=" + guests + "&partner_id=1";
    console.log(api_url);

    var response;
    var text;
    var json;
    
    while (completed == false) {

        response = await fetch(api_url)
        text = await response.text();
        json = JSON.parse(text);

        console.log(json["completed"]);
        completed = json["completed"];
    }

    res.set("Access-Control-Allow-Origin", "http://localhost:3001");
    res.send(`${JSON.stringify(json["hotels"].slice(0, 10))}`);
});

module.exports = router;