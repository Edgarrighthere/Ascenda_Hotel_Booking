function filterByPrice(priceRange, hotelListings) {
    const minPrice = priceRange[0]
    const maxPrice = priceRange[1]

    var filtered_list = []
    for (let hotel of hotelListings) {
        if (minPrice <= hotel.price && hotel.price <= maxPrice) {
            filtered_list.push(hotel)
        }
    }
    return filtered_list
}

function filterByRating(starRatings, hotelListings) {
    var filtered_list = []
    var rating = 0

    for (let i=0; i<starRatings.length; i++) {
        if (starRatings[i] === true) {
            rating = i+1
        }
        
        for (let hotel of hotelListings) {
            if (rating <= hotel.rating && hotel.rating < rating+1) {
                filtered_list.push(hotel)
            }
        }
    }
    return filtered_list
}

async function HotelFilter(hotelListings, priceRange, filterPrice, starRatings, filterRating) {
    var filtered_hotels = []

    if (filterPrice === true && filterRating === true) {
        var filtered_price = filterByPrice(priceRange, hotelListings)
        filtered_hotels = filterByRating(starRatings, filtered_price)
    }
    if (filterPrice === true && filterRating === false) {
        filtered_hotels = filterByPrice(priceRange, hotelListings)
    }
    if (filterPrice === false && filterRating === true) {
        filtered_hotels = filterByRating(starRatings, hotelListings)
    }
    return filtered_hotels
}

export default HotelFilter;