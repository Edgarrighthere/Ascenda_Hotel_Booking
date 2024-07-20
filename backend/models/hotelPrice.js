// Individual hotel price object
// Format: {id, searchRank, price}
// https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=tOik&checkin=2024-07-13&checkout=2024-07-20&lang=en_US&currency=SGD&country_code=SG&guests=1&partner_id=1

class hotelPrice {
    constructor(id, searchRank, price) {
        this.id = id;
        this.searchRank = searchRank;
        this.price = price;
    }
}

module.exports = {hotelPrice}