class Hotel {
    constructor(id, main_image_url, name, address, rating, price) {
        this.id = id;
        this.main_image_url = main_image_url;
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.price = price;
    }
}

module.exports = {Hotel}