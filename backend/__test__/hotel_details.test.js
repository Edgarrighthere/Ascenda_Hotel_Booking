const viewHotel = require("../routes/room_details")
const getHotelDetails = viewHotel.getHotelDetails
const getRooms = viewHotel.getRooms
const mapHotelDetails = viewHotel.mapHotelDetails
const mapRoomDetails = viewHotel.mapRoomDetails
const { RoomsAvailable } = require("../models/roomsAvailable.js")

const hotelId = "BN5n"
const destinationId = "RsBU"
const checkin = "2024-10-22"
const checkout = "2024-10-23"
const guests = "1"

const mockAmenities = {"airConditioning":true,"businessCenter":true,"clothingIron":true,"dataPorts":true,"dryCleaning":true,"hairDryer":true,"meetingRooms":true,"outdoorPool":true,"parkingGarage":true,"roomService":true,"safe":true,"tVInRoom":true,"voiceMail":true}
const mockHotelJSON = {"id":"BN5n","imageCount":31,"latitude":1.32059,"longitude":103.84514,"name":"Oasia Hotel Novena, Singapore","address":"8 Sinaran Drive","address1":"8 Sinaran Drive","rating":4.0,"trustyou":{"id":"5bb1a25e-897d-4124-8f47-2e8b7a311e69","score":{"overall":85.0,"kaligo_overall":4.3,"solo":85.0,"couple":87.0,"family":83.0,"business":83.0}},"categories":{},"amenities_ratings":[],"description":"<p><b>Property Location</b></p>","amenities":{},"original_metadata":{"name":null,"city":"Singapore","state":null,"country":"SG"},"image_details":{"suffix":".jpg","count":31,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/BN5n/"},"number_of_images":20,"default_image_index":1,"imgix_url":"https://kaligo-web-expedia.imgix.net","cloudflare_image_url":"https://www.kaligo-staging.xyz/images/new"}
const mockRoomsAvailableFromJSON = new RoomsAvailable("BN5n", 31, 1.32059, 103.84514, "Oasia Hotel Novena, Singapore", "8 Sinaran Drive", 4.0, {"id":"5bb1a25e-897d-4124-8f47-2e8b7a311e69","score":{"overall":85.0,"kaligo_overall":4.3,"solo":85.0,"couple":87.0,"family":83.0,"business":83.0}}, {}, [], "<p><b>Property Location</b></p>", {}, {"suffix":".jpg","count":31,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/BN5n/"}, 20, 1) 

const mockRoomData = {"key":"96A2A8AED87D26FE4ECEB0FBA2392BC1","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","free_cancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"special_check_in_instructions":null,"check_in_instructions":null,"know_before_you_go":null,"fees_optional":null,"fees_mandatory":null,"kaligo_service_fee":0,"hotel_fees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":38.02}]}},"description":"Superior Room","images":[{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg"},{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"}],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"price_type":"single","max_cash_payment":257.78,"coverted_max_cash_payment":348.2,"points":8700,"bonuses":0,"bonus_programs":[],"bonus_tiers":[],"lowest_price":257.78,"price":348.2,"converted_price":348.2,"lowest_converted_price":348.2,"chargeableRate":257.78,"market_rates":[],"base_rate":219.76,"included_taxes_and_fees_total":38.02,"excluded_taxes_and_fees_currency":"USD","excluded_taxes_and_fees_total":0,"excluded_taxes_and_fees_total_in_currency":0,"included_taxes_and_fees":[{"id":"tax_and_service_fee","amount":38.02}]}
const mockExtractedData = {"key":"96A2A8AED87D26FE4ECEB0FBA2392BC1","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","freeCancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"specialCheckInInstructions":null,"checkInInstructions":null,"knowBeforeYouGo":null,"feesOptional":null,"feesMandatory":null,"kaligoServiceFee":0,"hotelFees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":38.02}]}},"description":"Superior Room","images":["https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg", "https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"priceType":"single","points":8700,"lowestPrice":257.78,"price":348.2,"chargeableRate":257.78}

const mockRoomJSON = {"rooms": [
    {"key":"96A2A8AED87D26FE4ECEB0FBA2392BC1","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","free_cancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"special_check_in_instructions":null,"check_in_instructions":null,"know_before_you_go":null,"fees_optional":null,"fees_mandatory":null,"kaligo_service_fee":0,"hotel_fees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":38.02}]}},"description":"Superior Room","images":[{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg"},{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"}],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"price_type":"single","max_cash_payment":257.78,"coverted_max_cash_payment":348.2,"points":8700,"bonuses":0,"bonus_programs":[],"bonus_tiers":[],"lowest_price":257.78,"price":348.2,"converted_price":348.2,"lowest_converted_price":348.2,"chargeableRate":257.78,"market_rates":[],"base_rate":219.76,"included_taxes_and_fees_total":38.02,"excluded_taxes_and_fees_currency":"USD","excluded_taxes_and_fees_total":0,"excluded_taxes_and_fees_total_in_currency":0,"included_taxes_and_fees":[{"id":"tax_and_service_fee","amount":38.02}]},
    {"key":"C18F19BCEC2C27CE0CEF01CD15644B51","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","free_cancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"special_check_in_instructions":null,"check_in_instructions":null,"know_before_you_go":null,"fees_optional":null,"fees_mandatory":null,"kaligo_service_fee":0,"hotel_fees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":40.07}]}},"description":"Superior Room","images":[{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg"},{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"}],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"price_type":"single","max_cash_payment":271.71,"coverted_max_cash_payment":367.02,"points":9175,"bonuses":0,"bonus_programs":[],"bonus_tiers":[],"lowest_price":271.71,"price":367.02,"converted_price":367.02,"lowest_converted_price":367.02,"chargeableRate":271.71,"market_rates":[],"base_rate":231.64,"included_taxes_and_fees_total":40.07,"excluded_taxes_and_fees_currency":"USD","excluded_taxes_and_fees_total":0,"excluded_taxes_and_fees_total_in_currency":0,"included_taxes_and_fees":[{"id":"tax_and_service_fee","amount":40.07}]},
    {"key":"B141FC66F2D5DFDA71C2C7223F6A8BA7","roomDescription":"Deluxe Room","roomNormalizedDescription":"Deluxe Room","type":"DBT.DX","free_cancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"special_check_in_instructions":null,"check_in_instructions":null,"know_before_you_go":null,"fees_optional":null,"fees_mandatory":null,"kaligo_service_fee":0,"hotel_fees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":40.4}]}},"description":"Deluxe Room","images":[{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_008.jpg"},{"url":"https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_039.jpg"}],"amenities":["Electric Kettle","Children share the bed with parents","Smoke detector","Extra beds on demand","Alarm clock","Cot on demand","Disability-friendly bathroom","Tea and coffee making facilities ","Minibar"],"price_type":"single","max_cash_payment":273.98,"coverted_max_cash_payment":370.09,"points":9250,"bonuses":0,"bonus_programs":[],"bonus_tiers":[],"lowest_price":273.98,"price":370.09,"converted_price":370.09,"lowest_converted_price":370.09,"chargeableRate":273.98,"market_rates":[],"base_rate":233.58,"included_taxes_and_fees_total":40.4,"excluded_taxes_and_fees_currency":"USD","excluded_taxes_and_fees_total":0,"excluded_taxes_and_fees_total_in_currency":0,"included_taxes_and_fees":[{"id":"tax_and_service_fee","amount":40.4}]}
]}
const mockRoomsAvailableList = [
    {"key":"96A2A8AED87D26FE4ECEB0FBA2392BC1","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","freeCancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"specialCheckInInstructions":null,"checkInInstructions":null,"knowBeforeYouGo":null,"feesOptional":null,"feesMandatory":null,"kaligoServiceFee":0,"hotelFees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":38.02}]}},"description":"Superior Room","images":["https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg", "https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"priceType":"single","points":8700,"lowestPrice":257.78,"price":348.2,"chargeableRate":257.78},
    {"key":"C18F19BCEC2C27CE0CEF01CD15644B51","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","freeCancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"specialCheckInInstructions":null,"checkInInstructions":null,"knowBeforeYouGo":null,"feesOptional":null,"feesMandatory":null,"kaligoServiceFee":0,"hotelFees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":40.07}]}},"description":"Superior Room","images":["https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg", "https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"priceType":"single","points":9175,"lowestPrice":271.71,"price":367.02,"chargeableRate":271.71},
    {"key":"B141FC66F2D5DFDA71C2C7223F6A8BA7","roomDescription":"Deluxe Room","roomNormalizedDescription":"Deluxe Room","type":"DBT.DX","freeCancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"specialCheckInInstructions":null,"checkInInstructions":null,"knowBeforeYouGo":null,"feesOptional":null,"feesMandatory":null,"kaligoServiceFee":0,"hotelFees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":40.4}]}},"description":"Deluxe Room","images":["https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_008.jpg", "https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_039.jpg"],"amenities":["Electric Kettle","Children share the bed with parents","Smoke detector","Extra beds on demand","Alarm clock","Cot on demand","Disability-friendly bathroom","Tea and coffee making facilities ","Minibar"],"priceType":"single","points":9250,"lowestPrice":273.98,"price":370.09,"chargeableRate":273.98}
]

var mockRoomsAvailableObject = new RoomsAvailable("BN5n", 31, 1.32059, 103.84514, "Oasia Hotel Novena, Singapore", "8 Sinaran Drive", 4.0, {"id":"5bb1a25e-897d-4124-8f47-2e8b7a311e69","score":{"overall":85.0,"kaligo_overall":4.3,"solo":85.0,"couple":87.0,"family":83.0,"business":83.0}}, {}, [], "<p><b>Property Location</b></p>", {}, {"suffix":".jpg","count":31,"prefix":"https://d2ey9sqrvkqdfs.cloudfront.net/BN5n/"}, 20, 1) 
mockRoomsAvailableObject.rooms_available = [
    {"key":"96A2A8AED87D26FE4ECEB0FBA2392BC1","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","freeCancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"specialCheckInInstructions":null,"checkInInstructions":null,"knowBeforeYouGo":null,"feesOptional":null,"feesMandatory":null,"kaligoServiceFee":0,"hotelFees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":38.02}]}},"description":"Superior Room","images":["https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg", "https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"priceType":"single","points":8700,"lowestPrice":257.78,"price":348.2,"chargeableRate":257.78},
    {"key":"C18F19BCEC2C27CE0CEF01CD15644B51","roomDescription":"Superior Room","roomNormalizedDescription":"Superior Room","type":"DBT.SU","freeCancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"specialCheckInInstructions":null,"checkInInstructions":null,"knowBeforeYouGo":null,"feesOptional":null,"feesMandatory":null,"kaligoServiceFee":0,"hotelFees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":40.07}]}},"description":"Superior Room","images":["https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_006.jpg", "https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_018.jpg"],"amenities":["Electric Kettle","Smoke detector","Extra beds on demand","Pay movies","Disability-friendly bathroom","Carpeted floors","Radio"],"priceType":"single","points":9175,"lowestPrice":271.71,"price":367.02,"chargeableRate":271.71},
    {"key":"B141FC66F2D5DFDA71C2C7223F6A8BA7","roomDescription":"Deluxe Room","roomNormalizedDescription":"Deluxe Room","type":"DBT.DX","freeCancellation":true,"roomAdditionalInfo":{"breakfastInfo":"hotel_detail_room_only","displayFields":{"specialCheckInInstructions":null,"checkInInstructions":null,"knowBeforeYouGo":null,"feesOptional":null,"feesMandatory":null,"kaligoServiceFee":0,"hotelFees":[],"surcharges":[{"type":"TaxAndServiceFee","amount":40.4}]}},"description":"Deluxe Room","images":["https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_008.jpg", "https://photos.hotelbeds.com/giata/bigger/14/148673/148673a_hb_ro_039.jpg"],"amenities":["Electric Kettle","Children share the bed with parents","Smoke detector","Extra beds on demand","Alarm clock","Cot on demand","Disability-friendly bathroom","Tea and coffee making facilities ","Minibar"],"priceType":"single","points":9250,"lowestPrice":273.98,"price":370.09,"chargeableRate":273.98}
]

describe("Backend Hotel Details Unit Test", () => {
    test("BACKEND_HOTEL_DETAILS_UNIT_1: Test Hotel Details API with valid inputs", async() => {
        const json = await getHotelDetails(hotelId)
        const hotelDetails = Object.keys(json)
        const hotelDetails_notEmpty = hotelDetails.length > 0;
        expect(hotelDetails_notEmpty).toEqual(true);
    }, 20000)

    test("BACKEND_HOTEL_DETAILS_UNIT_2: Test Hotel Details API with invalid inputs (hotelId is undefined)", async() => {
        const invalid_hotelId = "undefined"
        const json = await getHotelDetails(invalid_hotelId)
        const hotelDetails = Object.keys(json)
        const hotelDetails_Empty = hotelDetails.length <= 0;
        expect(hotelDetails_Empty).toEqual(true);
    }, 20000)

    test("BACKEND_HOTEL_DETAILS_UNIT_3: Test Hotel Details API with invalid inputs (hotelId does not exist)", async() => {
        const invalid_hotelId = "abce"
        const json = await getHotelDetails(invalid_hotelId)
        const hotelDetails = Object.keys(json)
        const hotelDetails_Empty = hotelDetails.length <= 0;
        expect(hotelDetails_Empty).toEqual(true);
    }, 20000)

    test("BACKEND_HOTEL_DETAILS_UNIT_4: Test toTitleCase function of RoomsAvailable object", async() => {
        const newRoom = new RoomsAvailable()
        const input = "airConditioning"
        var titleCase = newRoom.toTitleCase(input)
        const expectedOutput = "Air Conditioning"
        expect(titleCase).toEqual(expectedOutput)
    })

    test("BACKEND_HOTEL_DETAILS_UNIT_5: Test cleanAmenities function of RoomsAvailable object", async() => {
        const newRoom = new RoomsAvailable()
        const cleanedAmenities = newRoom.cleanAmenities(mockAmenities)
        const expectedOutput = {'Air Conditioning': true,'Business Center': true,'Clothing Iron': true,'Data Ports': true,'Dry Cleaning': true,'Hair Dryer': true,'Meeting Rooms': true,'Outdoor Pool': true,'Parking Garage': true,'Room Service': true,'Safe': true,'TV In Room': true,'Voice Mail': true}
        expect(cleanedAmenities).toEqual(expectedOutput)
    })

    test("BACKEND_HOTEL_DETAILS_UNIT_6: Test fromJSON function of RoomsAvailable object", async() => {
        const JSONOutput = RoomsAvailable.fromJSON(mockHotelJSON)
        const expectedOutput = mockRoomsAvailableFromJSON
        expect(JSONOutput).toEqual(expectedOutput)
    })

    test("BACKEND_HOTEL_DETAILS_UNIT_7: Test mapping hotel_json to RoomsAvaliable object", async() => {
        const mappedRoomsAvailable = await mapHotelDetails(mockHotelJSON)
        const expectedOutput = mockRoomsAvailableFromJSON
        expect(mappedRoomsAvailable).toEqual(expectedOutput)
    })

    test("BACKEND_HOTEL_DETAILS_UNIT_8: Test Room Pricing API with valid inputs", async() => {
        const json = await getRooms(hotelId, destinationId, checkin, checkout, guests)
        const roomDetails_notEmpty =  json["rooms"].length > 0;
        expect(roomDetails_notEmpty).toEqual(true);
    }, 25000)

    test("BACKEND_HOTEL_DETAILS_UNIT_9: Test Room Pricing API with invalid inputs (hotelId is undefined)", async() => {
        const invalid_hotelId = "undefined"
        const json = await getRooms(invalid_hotelId, destinationId, checkin, checkout, guests)
        const roomDetails_Empty =  json["rooms"].length <= 0;
        expect(roomDetails_Empty).toEqual(true);
    }, 20000)

    test("BACKEND_HOTEL_DETAILS_UNIT_10: Test Room Pricing API with invalid inputs (hotelId does not exist)", async() => {
        const invalid_hotelId = "abce"
        const json = await getRooms(invalid_hotelId, destinationId, checkin, checkout, guests)
        const roomDetails_Empty =  json["rooms"].length <= 0;
        expect(roomDetails_Empty).toEqual(true);
    }, 20000)

    test("BACKEND_HOTEL_DETAILS_UNIT_11: Test Room Pricing API with invalid inputs (destinationId is undefined)", async() => {
        const invalid_destinationId = "undefined"
        const json = await getRooms(hotelId, invalid_destinationId, checkin, checkout, guests)
        const roomDetails_Empty =  json["rooms"].length <= 0;
        expect(roomDetails_Empty).toEqual(true);
    }, 20000)

    test("BACKEND_HOTEL_DETAILS_UNIT_12: Test extractRoomData function of RoomsAvailable object", async() => {
        const new_room = new RoomsAvailable()
        const extractedRoomData = new_room.extractRoomData(mockRoomData)
        const expectedOutput = mockExtractedData
        expect(extractedRoomData).toEqual(expectedOutput)
    })

    test("BACKEND_HOTEL_DETAILS_UNIT_13: Test populateRoomList function of RoomsAvailable object", async() => {
        const new_room = new RoomsAvailable()
        for (room of mockRoomJSON["rooms"]) {
            new_room.populateRoomList(room)
        }
        const roomsAvailableList = new_room.rooms_available
        const expectedOutput = mockRoomsAvailableList
        expect(roomsAvailableList).toEqual(expectedOutput)
    })

    test("BACKEND_HOTEL_DETAILS_UNIT_14: Test mapping room_json to RoomsAvailable object", async() => {
        const roomsAvailableList = await mapRoomDetails(mockRoomJSON, mockRoomsAvailableFromJSON)
        const expectedOutput = mockRoomsAvailableObject
        expect(roomsAvailableList).toEqual(expectedOutput)
    })
})

// integration test routes
// valid, hoteldid does not exist, checkin < current, checkout <= checkin, zero guests
describe("Backend Hotel Details Integration Test", () => {
    test("BACKEND_HOTEL_DETAILS_INT_1: Test room_details route with valid inputs", async() => {
        const res = await fetch(`http://localhost:5000/room_details/${hotelId}/${destinationId}/${checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text()
        const json = JSON.parse(text)
        const rooms_notEmpty = Object.keys(json).length > 0
        expect(res.status).toEqual(200)
        expect(rooms_notEmpty).toEqual(true)
    }, 10000)

    test("BACKEND_HOTEL_DETAILS_INT_2: Test room_details route with invalid inputs (hotelId does not exist)", async() => {
        const invalid_hotelId = "abce"
        const res = await fetch(`http://localhost:5000/room_details/${invalid_hotelId}/${destinationId}/${checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text()
        const json = JSON.parse(text)

        expect(res.status).toEqual(400);
        expect(json.message).toBe("No rooms found.")
    }, 10000)

    test("BACKEND_HOTEL_DETAILS_INT_3: Test room_details route with invalid inputs (checkin date < current date)", async() => {
        const invalid_checkin = "2024-05-05"
        const res = await fetch(`http://localhost:5000/room_details/${hotelId}/${destinationId}/${invalid_checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text()
        const json = JSON.parse(text)

        expect(res.status).toEqual(400);
        expect(json.message).toBe("Invalid Input: Check-in date cannot be before current date.")
    }, 10000)

    test("BACKEND_HOTEL_DETAILS_INT_4: Test room_details route with invalid inputs (checkout date <= checkin date)", async() => {
        const invalid_checkout = "2024-10-21"
        const res = await fetch(`http://localhost:5000/room_details/${hotelId}/${destinationId}/${checkin}/${invalid_checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text()
        const json = JSON.parse(text)

        expect(res.status).toEqual(400);
        expect(json.message).toBe("Invalid Input: Check-out date must be at least one day after check-in date.")
    }, 10000)

    test("BACKEND_HOTEL_DETAILS_INT_5: Test room_details route with invalid inputs (zero guests)", async() => {
        const invalid_guests = "0"
        const res = await fetch(`http://localhost:5000/room_details/${hotelId}/${destinationId}/${checkin}/${checkout}/${invalid_guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text()
        const json = JSON.parse(text)
       
        expect(res.status).toEqual(400);
        expect(json.message).toBe("Invalid Input: There must be at least 1 guest.")
    }, 10000)
})