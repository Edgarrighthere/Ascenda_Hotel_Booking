// Individual room object
// Add more attributes based on what you need
// Can check the hotelapi_output_format.txt file for the kind of attributes you can add
// https://hotelapi.loyalty.dev/api/hotels/diH7

class RoomsAvailable {
    constructor(
        id, 
        imageCount, 
        latitude, 
        longitude, 
        name, 
        address, 
        rating, 
        trustyou, 
        categories, 
        amenities_ratings, 
        description, 
        amenities, 
        image_details, 
        number_of_images, 
        default_image_index, 
    ) {
        this.id = id;
        this.imageCount = imageCount;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.trustyou = trustyou;
        this.categories = categories;
        this.amenities_ratings = amenities_ratings;
        this.description = description;
        this.amenities = this.cleanAmenities(amenities);
        this.image_details = image_details;
        this.number_of_images = number_of_images;
        this.default_image_index = default_image_index;
        this.rooms_available = []
    }

    cleanAmenities(amenities) {
        const cleanedAmenities = {}
        for(const key in amenities){
            if (amenities.hasOwnProperty(key)) {
                if(key === "tVInRoom" ){
                    cleanedAmenities["TV In Room"] = amenities[key];
                }
                else{
                const titleKey = this.toTitleCase(key);
                cleanedAmenities[titleKey] = amenities[key];
                }
            }
        }
        return cleanedAmenities;

        }
    
    toTitleCase(camelCase) {

        return camelCase
            .replace(/([A-Z])/g, ' $1') 
            .replace(/^./, str => str.toUpperCase()); 
    }
    populateRoomList(json){
        this.rooms_available.push(this.extractRoomData(json));
    }

    extractRoomData(data){
        return {
            key: data.key,
            roomDescription: data.roomDescription,
            roomNormalizedDescription: data.roomNormalizedDescription,
            type: data.type,
            freeCancellation: data.free_cancellation,
            roomAdditionalInfo: {
                breakfastInfo: data.roomAdditionalInfo.breakfastInfo,
                displayFields: {
                    specialCheckInInstructions: data.roomAdditionalInfo.displayFields.special_check_in_instructions,
                    checkInInstructions: data.roomAdditionalInfo.displayFields.check_in_instructions,
                    knowBeforeYouGo: data.roomAdditionalInfo.displayFields.know_before_you_go,
                    feesOptional: data.roomAdditionalInfo.displayFields.fees_optional,
                    feesMandatory: data.roomAdditionalInfo.displayFields.fees_mandatory,
                    kaligoServiceFee: data.roomAdditionalInfo.displayFields.kaligo_service_fee,
                    hotelFees: data.roomAdditionalInfo.displayFields.hotel_fees,
                    surcharges: data.roomAdditionalInfo.displayFields.surcharges.map(surcharge => ({
                        type: surcharge.type,
                        amount: surcharge.amount
                    }))
                }
            },
            description: data.description,
            images: data.images.map(image => image.url),
            amenities: data.amenities,
            priceType: data.price_type,
            points: data.points,
            lowestPrice: data.lowest_price,
            price: data.price,
            chargeableRate: data.chargeableRate,
        };

    }

    static fromJSON(data) {
        return new RoomsAvailable(
            data.id,
            data.imageCount,
            data.latitude,
            data.longitude,
            data.name,
            data.address,
            data.rating,
            data.trustyou,
            data.categories,
            data.amenities_ratings,
            data.description,
            data.amenities,
            data.image_details,
            data.number_of_images,
            data.default_image_index,
        );
    }
}

module.exports = {RoomsAvailable}