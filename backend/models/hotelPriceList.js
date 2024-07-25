const {hotelPrice} = require("./hotelPrice.js")

// List of all hotel ids & prices tihat match search parameters

class hotelPriceList {
    constructor(hotelPrices) {
        this.hotelPrices = hotelPrices // list
    }

    addHotel(id, searchRank, price) {
        var current_list = this.hotelPrices
        current_list.push(new hotelPrice(id, searchRank, price))
        this.hotelPrices = current_list
    }
}

module.exports = {hotelPriceList}
