const {Hotel} = require("./hotel.js")

// List of all hotels that match the search parameters

class hotelList {
    constructor(hotels) {
        this.hotels = hotels // list
    }

    addHotel(id, main_image_url, name, address, rating, starRating, priceListings) {
        var current_list = this.hotels
        var price = null
        
        for (let priceListing of priceListings) {
            if (priceListing.id === id) {
                price = priceListing.price
                break
            }
        }
        if (price != null) {
            current_list.push(new Hotel(id, main_image_url, name, address, rating, starRating, price))
        }
        this.hotels = current_list
    }
}

module.exports = {hotelList}

