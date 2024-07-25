const {Hotel} = require("./hotel.js")

// List of all hotels that match the search parameters

class hotelList {
    constructor(hotels) {
        this.hotels = hotels // list
    }

    addHotel(id, image_prefix, image_count, image_suffix, name, address, distance, description, categories, amenities, amenities_rating, score, rating, priceListings) {
        var current_list = this.hotels
        var price = null
        var searchRank = null
        
        for (let priceListing of priceListings) {
            if (priceListing.id === id) {
                price = priceListing.price
                searchRank = priceListing.searchRank
                break
            }
        }
        if (price != null) {
            // Calculate distance
            const new_distance = (distance / 1000).toFixed(2);
            rating = parseFloat(rating).toFixed(1);

            // Process categories object into list
            var categories_list = []
            if (Object.keys(categories).length > 0) {
                for (let item of Object.keys(categories)){
                    categories_list.push(categories[item])
                }
            }

            // Process amenities object into list
            var amenities_list = []
            if (Object.keys(amenities).length > 0) {
                amenities_list = Object.keys(amenities)
            }

            // Convert camelCase to Title Case
            for (let i=0; i<amenities_list.length; i++) {
                const text = amenities_list[i]
                const result = text.replace(/([A-Z])/g, " $1")
                var finalResult = result.charAt(0).toUpperCase() + result.slice(1)
                if (finalResult === "T V In Room") {
                    finalResult = "TV In Room"
                }
                amenities_list[i] = finalResult
            }

            // process score
            delete score.overall
            delete score.kaligo_overall

            const starRating = Math.floor(rating)

            current_list.push(new Hotel(id, image_prefix, image_count, image_suffix, name, address, new_distance, description, categories_list, amenities_list, amenities_rating, score, rating, starRating, searchRank, price))
        }
        this.hotels = current_list
    }

    sortBySearchRank() {
        this.hotels.sort((a, b) => {
            if (a.searchRank > b.searchRank) {
                return -1
            }
        })
    }
}

module.exports = {hotelList}

