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
        address1, 
        rating, 
        trustyou, 
        categories, 
        amenities_ratings, 
        description, 
        amenities, 
        original_metadata, 
        image_details, 
        hires_image_index, 
        number_of_images, 
        default_image_index, 
        imgix_url, 
        cloudflare_image_url
    ) {
        this.id = id;
        this.imageCount = imageCount;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.address = address;
        this.address1 = address1;
        this.rating = rating;
        this.trustyou = trustyou;
        this.categories = categories;
        this.amenities_ratings = amenities_ratings;
        this.description = description;
        this.amenities = this.cleanAmenities(amenities);
        this.original_metadata = original_metadata;
        this.image_details = image_details;
        this.hires_image_index = hires_image_index;
        this.number_of_images = number_of_images;
        this.default_image_index = default_image_index;
        this.imgix_url = imgix_url;
        this.cloudflare_image_url = cloudflare_image_url;
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
            maxCashPayment: data.max_cash_payment,
            covertedMaxCashPayment: data.coverted_max_cash_payment,
            points: data.points,
            bonuses: data.bonuses,
            bonusPrograms: data.bonus_programs,
            bonusTiers: data.bonus_tiers,
            lowestPrice: data.lowest_price,
            price: data.price,
            convertedPrice: data.converted_price,
            lowestConvertedPrice: data.lowest_converted_price,
            chargeableRate: data.chargeableRate,
            marketRates: data.market_rates,
            baseRate: data.base_rate,
            includedTaxesAndFeesTotal: data.included_taxes_and_fees_total,
            excludedTaxesAndFeesTotal: data.excluded_taxes_and_fees_total,
            excludedTaxesAndFeesTotalInCurrency: data.excluded_taxes_and_fees_total_in_currency,
            includedTaxesAndFees: data.included_taxes_and_fees.map(taxFee => ({
                id: taxFee.id,
                amount: taxFee.amount
            }))
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
            data.address1,
            data.rating,
            data.trustyou,
            data.categories,
            data.amenities_ratings,
            data.description,
            data.amenities,
            data.original_metadata,
            data.image_details,
            data.hires_image_index,
            data.number_of_images,
            data.default_image_index,
            data.imgix_url,
            data.cloudflare_image_url
        );
    }
}

module.exports = {RoomsAvailable}