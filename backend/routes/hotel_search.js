const express = require("express");
var router = express.Router();
const {hotelPriceList} = require("../models/hotelPriceList.js")
const {hotelList} = require("../models/hotelList.js")

/* GET price listings from input parameters. */
router.get("/:id/:checkin/:checkout/:guests", async function (req, res, next) {
    const destinationId = req.params.id;
    const checkin = req.params.checkin;
    const checkout = req.params.checkout;
    const guests = req.params.guests;
    
    var completed = false;
    var counter = 0;
    const price_api_url = "https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=" + destinationId + "&checkin=" + checkin + "&checkout=" + checkout + "&lang=en_US&currency=SGD&country_code=SG" + "&guests=" + guests + "&partner_id=1";
    console.log(price_api_url);

    var price_response;
    var price_text;
    var price_json;
    
    // try to see if can retrieve listing even when completed = false
    // but for now, set arbitary counter of 5 
    while (completed == false) {

        price_response = await fetch(price_api_url)
        price_text = await price_response.text();
        price_json = JSON.parse(price_text);

        console.log(price_json["completed"]);
        completed = price_json["completed"];
        counter += 1;
    }

    // if (counter == 5) {
    //     res.send("Timeout");
    // }
    
    const priceList = new hotelPriceList([])
    price_json["hotels"].map(jsonPrices => {
        // currently implementing a hard limit of max $5000 price so that the slider range isnt ridiculous
        if (jsonPrices.price <= 5000) {
            priceList.addHotel(jsonPrices.id, jsonPrices.price)
        }
    })

    const hotel_api_url = "https://hotelapi.loyalty.dev/api/hotels?destination_id=" + destinationId + "&checkin=" + checkin + "&checkout=" + checkout + "&lang=en_US&currency=SGD&country_code=SG" + "&guests=" + guests + "&partner_id=1";
    console.log(hotel_api_url);

    const hotel_response = await fetch(hotel_api_url)
    const hotel_text = await hotel_response.text();
    const hotel_json = JSON.parse(hotel_text);

    const hotelListings = new hotelList([])
    hotel_json.map(jsonHotels => {
        if (jsonHotels.trustyou.score.kaligo_overall > 0) {
            hotelListings.addHotel(
                id=jsonHotels.id,
                main_image_url=jsonHotels.image_details.prefix + "1" + jsonHotels.image_details.suffix,
                name=jsonHotels.name,
                address=jsonHotels.address,
                rating=jsonHotels.trustyou.score.kaligo_overall,
                priceListings=priceList["hotelPrices"])
        }
    })

    //console.log(hotelListings)

    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.send(`${JSON.stringify(hotelListings["hotels"])}`); // return a list of hotels
});

module.exports = router;