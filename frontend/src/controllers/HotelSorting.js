function sortByPrice(hotelListings) {
    var sorted = hotelListings.sort((a, b) => {
        if (parseFloat(a.price) < parseFloat(b.price)) {
            return -1
        }
    })
    return sorted
}

function sortByRating(hotelListings) {
    var sorted = hotelListings.sort((a, b) => {
        if (a.rating > b.rating) {
            return -1
        }
    })
    return sorted
}

async function HotelSorting(hotelListings, sortPrice, sortRating) {
    var sortedListings

    if (hotelListings.length === 0) {
        sortedListings = []
    } else {
        if (sortPrice === true && sortRating === false) {
            sortedListings = sortByPrice(hotelListings)
        } else if (sortRating === true && sortPrice === false) {
            sortedListings = sortByRating(hotelListings)
        } else {
            sortedListings = []
        }
    }
    return sortedListings
}

module.exports = {
    HotelSorting: HotelSorting,
    sortByPrice: sortByPrice,
    sortByRating: sortByRating
}