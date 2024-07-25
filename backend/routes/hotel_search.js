const express = require("express");
var router = express.Router();
const {hotelPriceList} = require("../models/hotelPriceList.js")
const {hotelList} = require("../models/hotelList.js")

async function getPricing(destinationId, checkin, checkout, guests) {
    var completed = false
    const price_api_url = "https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=" + destinationId + "&checkin=" + checkin + "&checkout=" + checkout + "&lang=en_US&currency=SGD&country_code=SG" + "&guests=" + guests + "&partner_id=1"
    //console.log(price_api_url)

    var price_response;
    var price_text;
    var price_json;
    
    while (completed == false) {
        price_response = await fetch(price_api_url)
        price_text = await price_response.text()
        price_json = JSON.parse(price_text)

        //console.log(price_json["completed"])
        completed = price_json["completed"]
    }

    return price_json
}

async function mapPriceList(price_json) {
    const priceList = new hotelPriceList([])
    price_json["hotels"].map(jsonPrices => {
        var convertedPrice = parseFloat(jsonPrices.price).toFixed(2)
        priceList.addHotel(jsonPrices.id, jsonPrices.searchRank, convertedPrice)
    })
    return priceList
}

async function getListing(destinationId) {
    const hotel_api_url = "https://hotelapi.loyalty.dev/api/hotels?destination_id=" + destinationId
    //console.log(hotel_api_url)

    const hotel_response = await fetch(hotel_api_url)
    const hotel_text = await hotel_response.text()
    const hotel_json = JSON.parse(hotel_text)
    return hotel_json
}

async function mapHotelList(hotel_json, priceList) {
    const hotelListings = new hotelList([])
    hotel_json.map(jsonHotels => {
        if (jsonHotels.trustyou.score.kaligo_overall > 0) {
            hotelListings.addHotel(
                id=jsonHotels.id,
                image_prefix=jsonHotels.image_details.prefix,
                image_count=jsonHotels.image_details.count,
                image_suffix=jsonHotels.image_details.suffix,
                name=jsonHotels.name,
                address=jsonHotels.address,
                distance=jsonHotels.distance,
                description=jsonHotels.description,
                categories=jsonHotels.categories,
                amenities=jsonHotels.amenities,
                amenities_rating=jsonHotels.amenities_ratings,
                score=jsonHotels.trustyou.score,
                rating=jsonHotels.trustyou.score.kaligo_overall,
                priceListings=priceList["hotelPrices"])
        }
    })
    hotelListings.sortBySearchRank()
    return hotelListings
}

/* GET price listings from input parameters. */
router.get("/:id/:checkin/:checkout/:guests", async function (req, res, next) {
    const currentDate = new Date().toISOString().slice(0, 10)
    const destinationId = req.params.id
    const checkin = req.params.checkin
    const checkout = req.params.checkout
    const guests = req.params.guests

    res.set("Access-Control-Allow-Origin", "http://localhost:3000");

    if (checkin < currentDate) {
        return res.status(400).json({message: "Invalid Input: Check-in date cannot be before current date."})
    } else if (checkin >= checkout) {
        return res.status(400).json({message: "Invalid Input: Check-out date must be at least one day after check-in date."})
    } else if (guests == 0 || guests == null) {
        return res.status(400).json({message: "Invalid Input: There must be at least 1 guest."})
    } else {
        const price_json = await getPricing(destinationId, checkin, checkout, guests)

        //console.log(price_json["hotels"])
        
        if (price_json["hotels"].length > 0) {
            const priceList = await mapPriceList(price_json)
            const hotel_json = await getListing(destinationId)
            const hotelListings = await mapHotelList(hotel_json, priceList)
            res.send(`${JSON.stringify(hotelListings["hotels"])}`); // return a list of hotels
        } else {
            //console.log(price_json["hotels"])
            return res.status(400).json({message: "No hotel listings found."})
        }
    }
})

module.exports = {
    getPricing: getPricing,
    mapPriceList: mapPriceList,
    getListing: getListing,
    mapHotelList: mapHotelList,
    router: router
}