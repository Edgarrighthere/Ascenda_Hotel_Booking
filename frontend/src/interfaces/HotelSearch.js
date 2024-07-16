import { format } from "date-fns";

async function HotelSearch(destination, date, options) {
    // Retrieve destination ID based on destination name
    const destination_response = await fetch(`http://localhost:5000/destination_search/${destination}`, {
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    const destinationId = await destination_response.text()

    // Format date
    const checkin = format(date[0].startDate,"yyyy-MM-dd")
    const checkout = format(date[0].endDate, "yyyy-MM-dd")

    // Format guest and room count
    const guest_count = options.adult + options.children;
    const room_count = options.rooms;
    var guests = `${guest_count}`
    
    if (room_count > 1) {
        guests += `|${guest_count}` 
    }

    // Retrieve hotel listings based on input parameters
    const search_response = await fetch(`http://localhost:5000/hotel_search/${destinationId}/${checkin}/${checkout}/${guests}`, {
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    const hotelListings = await search_response.json()
    const listingsLength = hotelListings.length
    const pageCount = Math.ceil(listingsLength/10)

    // Calculate price range based on hotel listings
    var listings = hotelListings
    var priceArray = []
    listings.filter(obj => {
        priceArray.push(obj.price)
    })
    
    var minPrice = Math.min(...priceArray)
    var maxPrice = Math.max(...priceArray)
    var roundedMinPrice = Math.round(minPrice/10)*10
    var roundedMaxPrice = Math.round(maxPrice/10)*10

    const priceRange = [roundedMinPrice, roundedMaxPrice]

    return {
        searchParameters : {
            id: destinationId,
            checkin: checkin,
            checkout: checkout,
            guests: guests
        },
        listings: hotelListings, 
        range: priceRange,
        pageCount: pageCount
    }
}

export default HotelSearch;