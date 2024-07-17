// Individual hotel object
// Add more attributes based on what you need
// Can check the hotelapi_output_format.txt file for the kind of attributes you can add
// https://hotelapi.loyalty.dev/api/hotels?destination_id=tOik

class Hotel {
    constructor(id, image_prefix, image_count, image_suffix, name, address, distance, description, categories, amenities, amenities_rating, score, rating, starRating, price) {
        this.id = id;
        this.image_prefix = image_prefix;
        this.image_count = image_count;
        this.image_suffix = image_suffix;
        this.name = name;
        this.address = address;
        this.distance = distance;
        this.description = description;

        this.categories = categories; // {name, score, popularity}
        this.amenities = amenities; // {name, score}
        this.amenities_rating = amenities_rating; // {name: true}
        
        this.score = score; // {overall, solo, couple, family, business}
        this.rating = rating;
        this.starRating = starRating;
        this.price = price;
    }
}

module.exports = {Hotel}