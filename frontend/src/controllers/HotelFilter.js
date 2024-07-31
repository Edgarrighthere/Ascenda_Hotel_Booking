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
    var filteredHotels
    var filteredPages
    var filteredPriceRange

    if (hotelListings.length === 0) {

        filteredHotels = []
        filteredPages = 1
        filteredPriceRange = [0.00, 0.00]
    
    } else {
        
        if (filterPrice === true && filterRating === true && priceRange.length > 0 && starRatings.length > 0) {
            var filtered_price = filterByPrice(priceRange, hotelListings)
            filteredHotels = filterByRating(starRatings, filtered_price)
        } else if (filterPrice === true && filterRating === false && priceRange.length > 0) {
            filteredHotels = filterByPrice(priceRange, hotelListings)
        } else if (filterPrice === false && filterRating === true && starRatings.length > 0) {
            filteredHotels = filterByRating(starRatings, hotelListings)
        } else {
            filteredHotels = []
            filteredPages = 1
            filteredPriceRange = [0.00, 0.00]
        }
        
        const filteredCount = filteredHotels.length
    
        if (filteredCount === 0) { // no output
            filteredPages = 1
            filteredPriceRange = [0.00, 0.00]
    
        } else {
            filteredPages = Math.ceil(filteredCount/10)

            var listings = filteredHotels
            var priceArray = []
            listings.filter(obj => {
                priceArray.push(obj.price)
            })
    
            var minPrice = Math.min(...priceArray)
            var maxPrice = Math.max(...priceArray)
            var roundedMinPrice = Math.floor(minPrice/10)*10
            var roundedMaxPrice = Math.ceil(maxPrice/10)*10
    
            filteredPriceRange = [roundedMinPrice, roundedMaxPrice]
        }

    }
    
    return {
        hotels: filteredHotels,
        pages: filteredPages,
        range: filteredPriceRange
    }
}

module.exports = {
    HotelFilter: HotelFilter,
    filterByPrice: filterByPrice,
    filterByRating: filterByRating
};