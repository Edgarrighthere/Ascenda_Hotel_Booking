const {hotelPrice} = require("./hotelPrice.js")

// List of all hotel ids & prices tihat match search parameters

class hotelPriceList {
    constructor(hotelPrices) {
        this.hotelPrices = hotelPrices // list
    }

    addHotel(id, price) {
        var current_list = this.hotelPrices
        current_list.push(new hotelPrice(id, price))
        this.hotelPrices = current_list
    }

    returnAllIds() {
        var id_list = []
        for (let hotelPrice of this.hotelPrices) {
            id_list.push(hotelPrice.id)
        }
        return id_list
    }

    calculatePriceRange() {
        // Filter for price
        var priceArray = []
        this.hotelPrices.filter(obj => {
            priceArray.push(obj.price)
        })
        const minPrice = Math.min(...priceArray)
        const maxPrice = Math.max(...priceArray)
        const priceRange = [minPrice, maxPrice]
        return priceRange
    }
}

module.exports = {hotelPriceList}
