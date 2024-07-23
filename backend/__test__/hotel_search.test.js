const hotelSearch = require("../routes/hotel_search")
const getPricing = hotelSearch.getPricing
const mapPriceList = hotelSearch.mapPriceList
const getListing = hotelSearch.getListing
const mapHotelList = hotelSearch.mapHotelList

const destinationId = "tOik"
const checkin = "2024-10-22"
const checkout = "2024-10-23"
const guests = "1"

const mockPriceJson = {
    "completed": true,
    "hotels": [
        {"id": "0CjM", "searchRank": "0.5", "price_type": "multi", "points": 3400, "price": "100"},
        {"id": "00Y3", "searchRank": "2.5", "price_type": "multi", "points": 1200, "price": "500.2"},
        {"id": "0dJR", "searchRank": "1.0", "price_type": "multi", "points": 5748, "price": "300.16"},
        {"id": "0E35", "searchRank": "1.5", "price_type": "multi", "points": 2389, "price": "450.00"},
    ]
}

const mockHotelJson = [
    {"id":"00Y3","imageCount":0,"latitude":52.5114826,"longitude":13.4168442,"name":"Berlinlux Apartments City","address":"Bruckenstra E 1A","address1":"Bruckenstra E 1A","rating":0.0,"distance":5971.332887252599,"trustyou":{"id":null,"score":{"overall":"64.0","kaligo_overall":3.2,"solo":null,"couple":null,"family":null,"business":null}},"categories":{},"amenities_ratings":[],"amenities":{},"original_metadata":{"name":null,"city":"Berlin","state":null,"country":"DE"},"image_details":{"suffix":".jpg","count":0,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/00Y3/"},"number_of_images":0,"default_image_index":1,"imgix_url":"https://kaligo-web-old.imgix.net","cloudflare_image_url":"https://www.kaligo-staging.xyz/images/old"},
    {"id":"0CHr","imageCount":8,"latitude":52.52870178,"longitude":13.42469978,"name":"Alex Hotel","address":"Greifswalder Str. 3","address1":"Greifswalder Str. 3","rating":2.0,"distance":5973.319525351592,"trustyou":{"id":null,"score":{"overall":"78.0","kaligo_overall":3.9,"solo":"77.0","couple":"80.0","family":"76.0","business":"74.0"}},"categories":{"overall":{"name":"Overall","score":78,"popularity":44.0},"city_hotel":{"name":"City Hotel","score":95,"popularity":3.990341635687733}},"amenities_ratings":[{"name":"Service","score":95},{"name":"Location","score":92},{"name":"Food","score":78},{"name":"Room","score":64},{"name":"WiFi","score":58},{"name":"Amenities","score":28}],"description":"Property Location","amenities":{"clothingIron":true,"continentalBreakfast":true,"dataPorts":true,"hairDryer":true,"parkingGarage":true,"safe":true,"tVInRoom":true},"original_metadata":{"name":null,"city":"Berlin","state":null,"country":"DE"},"image_details":{"suffix":".jpg","count":8,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/0CHr/"},"number_of_images":34,"default_image_index":1,"imgix_url":"https://kaligo-web-expedia.imgix.net","cloudflare_image_url":"https://www.kaligo-staging.xyz/images/new"},
    {"id":"0CjM","imageCount":62,"latitude":52.50116,"longitude":13.33096,"name":"Amc Apartments Ku Damm","address":"Joachimstaler Str. 19 (office)","address1":"Joachimstaler Str. 19 (office)","rating":3.5,"distance":5968.564847627716,"trustyou":{"id":"beaf0b77-53a8-4136-bb8b-cd2e04367eda","score":{"overall":"83.0","kaligo_overall":4.2,"solo":"80.0","couple":"78.0","family":"79.0","business":"80.0"}},"categories":{},"amenities_ratings":[],"description":"Property Location","amenities":{},"original_metadata":{"name":null,"city":"Berlin","state":null,"country":"DE"},"image_details":{"suffix":".jpg","count":62,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/0CjM/"},"number_of_images":58,"default_image_index":1,"imgix_url":"https://kaligo-web-expedia.imgix.net","cloudflare_image_url":"https://www.kaligo-staging.xyz/images/new"},
    {"id":"0DaK","imageCount":43,"latitude":52.5108909606934,"longitude":13.3759775161743,"name":"Berlin Marriott Hotel","address":"Inge-Beisheim-Platz 1","address1":"Inge-Beisheim-Platz 1","rating":5.0,"distance":5970.474799878792,"trustyou":{"id":"da00834e-2ad4-40b2-a64d-5c2bd61d5d6a","score":{"overall":"90.0","kaligo_overall":4.5,"solo":"89.0","couple":"86.0","family":"86.0","business":"84.0"}},"categories":{"overall":{"name":"Overall","score":88,"popularity":6.0},"design_hotel":{"name":"Design Hotel","score":93,"popularity":2.33420780669145},"luxury_hotel":{"name":"Luxury Hotel","score":92,"popularity":6.612553531598513},"business_hotel":{"name":"Business Hotel","score":92,"popularity":7.348613011152416}},"amenities_ratings":[{"name":"Location","score":94},{"name":"Comfort","score":87},{"name":"Service","score":83},{"name":"Room","score":79},{"name":"Food","score":75},{"name":"Wellness","score":74},{"name":"Pool","score":63},{"name":"WiFi","score":43}],"description":"Property Location","amenities":{"airConditioning":true,"businessCenter":true,"clothingIron":true,"dataPorts":true,"dryCleaning":true,"hairDryer":true,"indoorPool":true,"meetingRooms":true,"miniBarInRoom":true,"parkingGarage":true,"roomService":true,"safe":true,"sauna":true,"tVInRoom":true,"voiceMail":true},"original_metadata":{"name":null,"city":"Berlin","state":null,"country":"DE"},"image_details":{"suffix":".jpg","count":43,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/0DaK/"},"hires_image_index":"0,1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,31,32,33,34,35,36,37,38,39,40,41,42","number_of_images":46,"default_image_index":1,"imgix_url":"https://kaligo-web-expedia.imgix.net","cloudflare_image_url":"https://www.kaligo-staging.xyz/images/new"},
    {"id":"0dJR","imageCount":2,"latitude":52.50322,"longitude":13.318589,"name":"WAIZENEGGER PENSION","address":"Mommsenstrasse, 6 - 10629","address1":"Mommsenstrasse, 6 - 10629","rating":2.5,"distance":5968.544804532365,"trustyou":{"id":"141ed25f-8258-47d8-8eff-49c6cbd6fc65","score":{"overall":"78.0","kaligo_overall":3.9,"solo":"71.0","couple":"76.0","family":"76.0","business":"67.0"}},"categories":{},"amenities_ratings":[],"description":"HOTEL: This guesthouse it is situated in an old building and is ideal for holidays","amenities":{},"original_metadata":{"name":null,"city":"Ber","state":"Berlin","country":"DE"},"image_details":{"suffix":".jpg","count":2,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/0dJR/"},"number_of_images":28,"default_image_index":1,"imgix_url":"https://kaligo-web-expedia.imgix.net","cloudflare_image_url":"https://www.kaligo-staging.xyz/images/new"},
    {"id":"0E35","imageCount":16,"latitude":52.536385,"longitude":13.43356,"name":"RockChair Apartment Greifswalder Straße","address":"Greifswalder Str.","address1":"Greifswalder Str.","rating":4.0,"distance":5974.310292536924,"trustyou":{"id":null,"score":{"overall":null,"kaligo_overall":0.0,"solo":null,"couple":null,"family":null,"business":null}},"categories":{},"amenities_ratings":[],"description":"Free self parking is available onsite.","amenities":{},"original_metadata":{"name":null,"city":"Berlin","state":null,"country":"DE"},"image_details":{"suffix":".jpg","count":16,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/0E35/"},"number_of_images":16,"default_image_index":1,"imgix_url":"https://kaligo-web-old.imgix.net","cloudflare_image_url":"https://www.kaligo-staging.xyz/images/old"}
]

describe("Backend Hotel Search API Unit Test", () => {

    test("BACKEND_HOTEL_SEARCH_API_1: Test Pricing API with valid inputs", async() => {
        const json = await getPricing(destinationId, checkin, checkout, guests);
        const prices = json["hotels"]
        const prices_notEmpty = prices.length > 0;
        expect(prices_notEmpty).toEqual(true); // hotels should not be empty
    }, 15000)

    test("BACKEND_HOTEL_SEARCH_API_2: Test Pricing API with invalid inputs (destination id does not exist)", async() => {
        // even if completed is true, hotels should be empty
        const invalid_destinationId = "abce"
        const res = await fetch(`http://localhost:5000/hotel_search/${invalid_destinationId}/${checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });
        const text = await res.text();
        const json = JSON.parse(text);

        expect(res.status).toEqual(400);
        expect(json.message).toBe("No hotel listings found.")
        
    }, 10000)

    test("BACKEND_HOTEL_SEARCH_API_3: Test Pricing API with invalid inputs (check-in date < current date)", async() => {
        // even if completed is true, hotels should be empty
        const invalid_checkin = "2024-07-21";
        const res = await fetch(`http://localhost:5000/hotel_search/${destinationId}/${invalid_checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });
        const text = await res.text();
        const json = JSON.parse(text);

        expect(res.status).toEqual(400);
        expect(json.message).toBe("Invalid Input: Check-in date cannot be before current date.")
    }, 10000)

    test("BACKEND_HOTEL_SEARCH_API_4: Test Pricing API with invalid inputs (check-in date <= check-out date)", async() => {
        // even if completed is true, hotels should be empty
        const invalid_checkout = "2024-07-22";
        const res = await fetch(`http://localhost:5000/hotel_search/${destinationId}/${checkin}/${invalid_checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });
        const text = await res.text();
        const json = JSON.parse(text);

        expect(res.status).toEqual(400);
        expect(json.message).toBe("Invalid Input: Check-out date must be at least one day after check-in date.")
        
    }, 10000)

    test("BACKEND_HOTEL_SEARCH_API_5: Test Pricing API with invalid inputs (zero guests)", async() => {
        const invalid_guests = "0";
        const res = await fetch(`http://localhost:5000/hotel_search/${destinationId}/${checkin}/${checkout}/${invalid_guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });
        const text = await res.text();
        const json = JSON.parse(text);

        expect(res.status).toEqual(400);
        expect(json.message).toBe("Invalid Input: There must be at least 1 guest.")
    }, 10000)

    test("BACKEND_HOTEL_SEARCH_API_6: Test Pricing API with valid inputs but no possible output", async() => {
        const new_destinationId = "aq3t"
        const new_guests = "3|3|3|3|3|3|3|3|3|3"
        const json = await getPricing(new_destinationId, checkin, checkout, new_guests);
        const prices = json["hotels"]
        const prices_Empty = prices.length <= 0;
        expect(prices_Empty).toEqual(true);
    }, 10000)

    test("BACKEND_HOTEL_SEARCH_API_7: Test mapping price json to price list object", async() => {
        const priceList = await mapPriceList(mockPriceJson)
        const expectedPriceList = {"hotelPrices": [
            {"id": "0CjM", "searchRank": "0.5", "price": "100.00"},
            {"id": "00Y3", "searchRank": "2.5", "price": "500.20"},
            {"id": "0dJR", "searchRank": "1.0", "price": "300.16"},
            {"id": "0E35", "searchRank": "1.5", "price": "450.00"},
        ]}
        expect(priceList).toEqual(expectedPriceList)
    })

    test("BACKEND_HOTEL_SEARCH_API_8: Test Listing API with valid inputs", async() => {
        const json = await getListing(destinationId);
        const json_notEmpty = json.length > 0;
        expect(json_notEmpty).toEqual(true); // hotels should not be empty
    })

    test("BACKEND_HOTEL_SEARCH_API_9: Test Listing API with invalid inputs (destination id is undefined)", async() => {
        const invalid_destinationId = "undefined"
        const json = await getListing(invalid_destinationId);
        const json_Empty = json.length <= 0;
        expect(json_Empty).toEqual(true);
    })

    test("BACKEND_HOTEL_SEARCH_API_10: Test Listing API with invalid inputs (destination id does not exist)", async() => {
        const invalid_destinationId = "abce"
        const json = await getListing(invalid_destinationId);
        const json_Empty = json.length <= 0;
        expect(json_Empty).toEqual(true);
    })

    test("BACKEND_HOTEL_SEARCH_API_11: Test mapping hotel json to hotel list object", async() => {
        const priceList = await mapPriceList(mockPriceJson)
        const hotelListings = await mapHotelList(mockHotelJson, priceList)
        const expectedHotelListings = {"hotels": [
            {"address": "Bruckenstra E 1A", "amenities": [], "amenities_rating": [], "categories": [], "description": undefined, "distance": "5.97", "id": "00Y3", "image_count": 0, "image_prefix": "https://d2ey9sqrvkqdfs.cloudfront.net/00Y3/", "image_suffix": ".jpg", "name": "Berlinlux Apartments City", "price": "500.20", "rating": "3.2", "score": {"business": null, "couple": null, "family": null, "solo": null}, "searchRank": "2.5", "starRating": 3},
            {"address": "Mommsenstrasse, 6 - 10629", "amenities": [], "amenities_rating": [], "categories": [], "description": "HOTEL: This guesthouse it is situated in an old building and is ideal for holidays", "distance": "5.97", "id": "0dJR", "image_count": 2, "image_prefix": "https://d2ey9sqrvkqdfs.cloudfront.net/0dJR/", "image_suffix": ".jpg", "name": "WAIZENEGGER PENSION", "price": "300.16", "rating": "3.9", "score": {"business": "67.0","couple": "76.0","family": "76.0","solo": "71.0"}, "searchRank": "1.0", "starRating": 3}, 
            {"address": "Joachimstaler Str. 19 (office)", "amenities": [], "amenities_rating": [], "categories": [], "description": "Property Location", "distance": "5.97", "id": "0CjM", "image_count": 62, "image_prefix": "https://d2ey9sqrvkqdfs.cloudfront.net/0CjM/", "image_suffix": ".jpg", "name": "Amc Apartments Ku Damm", "price": "100.00", "rating": "4.2", "score": {"business": "80.0", "couple": "78.0", "family": "79.0", "solo": "80.0"}, "searchRank": "0.5", "starRating": 4},
        ]}
        expect(hotelListings).toEqual(expectedHotelListings)
    })

})

// describe("Backend Hotel Search API Integration Test", () => {

//     // Call graph:



//     test("BACKEND_HOTEL_SEARCH")

// })