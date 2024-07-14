// Individual hotel object
// Add more attributes based on what you need
// Can check the hotelapi_output_format.txt file for the kind of attributes you can add
// https://hotelapi.loyalty.dev/api/hotels?destination_id=tOik

class Hotel {
    constructor(id, main_image_url, name, address, rating, starRating, price) {
        this.id = id;
        this.main_image_url = main_image_url;
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.starRating = starRating;
        this.price = price;
    }
}

module.exports = {Hotel}