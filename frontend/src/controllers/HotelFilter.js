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

function calculateNewPriceRange() {
    
}

async function HotelFilter(hotelListings, priceRange, filterPrice, starRatings, filterRating) {
    var filtered_hotels = []
    var filteredPriceRange = []

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

    console.log(filtered_hotels.length)

    if (filtered_count == 0) {
        filteredPriceRange = [0.00, 0.00]

    } else {
        var listings = filtered_hotels
        var priceArray = []
        listings.filter(obj => {
            priceArray.push(obj.price)
        })

        var minPrice = Math.min(...priceArray)
        var maxPrice = Math.max(...priceArray)
        var roundedMinPrice = Math.round(minPrice/10)*10
        var roundedMaxPrice = Math.round(maxPrice/10)*10

        console.log(minPrice, maxPrice, roundedMinPrice, roundedMaxPrice)

        filteredPriceRange = [roundedMinPrice, roundedMaxPrice]
    }
    
    return {
        hotels: filtered_hotels,
        pages: filtered_pages,
        range: filteredPriceRange
    }
}

export default HotelFilter;