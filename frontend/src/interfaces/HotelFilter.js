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

    console.log(starRatings)
    for (let i=0; i<starRatings.length; i++) {
        if (starRatings[i] === true) {
            rating = i+1
            for (let hotel of hotelListings) {
                if (hotel.starRating === rating) {
                    filtered_list.push(hotel)
                }
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
    
    const filtered_count = filtered_hotels.length
    const filtered_pages = Math.ceil(filtered_count/10)

    var listings = filtered_hotels
    var priceArray = []
    listings.filter(obj => {
        priceArray.push(obj.price)
    })
    const minPrice = Math.min(...priceArray)
    const maxPrice = Math.max(...priceArray)
    const filteredPriceRange = [minPrice, maxPrice]
    
    return {
        hotels: filtered_hotels,
        pages: filtered_pages,
        range: filteredPriceRange
    }
}

export default HotelFilter;