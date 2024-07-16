async function HotelSorting(hotelListings, sortByPrice, sortByRating) {
    var sorted_listings
    
    if (sortByPrice === true) {
        sorted_listings = hotelListings.sort((a, b) => {
            if (a.price < b.price) {
                return -1
            }
        })
    }

    if (sortByRating === true) {
        sorted_listings = hotelListings.sort((a, b) => {
            if (a.rating > b.rating) {
                return -1
            }
        })
    }

    return sorted_listings
}

export default HotelSorting