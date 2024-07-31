var HotelFilterController = require('../../frontend/src/controllers/HotelFilter');
const HotelFilter = HotelFilterController.HotelFilter
const filterByPrice = HotelFilterController.filterByPrice
const filterByRating = HotelFilterController.filterByRating

const mockHotelListings = [
    {"id": "0CjM", "price": "100.00", "starRating": 3},
    {"id": "00Y3", "price": "500.20", "starRating": 3},
    {"id": "0dJR", "price": "300.16", "starRating": 3},
    {"id": "0E35", "price": "450.00", "starRating": 4},
    {"id": "QtQc", "price": "59.80", "starRating": 2},
    {"id": "7ns4", "price": "616.00", "starRating": 4},
    {"id": "Sr3q", "price": "245.89", "starRating": 2},
    {"id": "Hd39", "price": "356.10", "starRating": 3},
]

const mockPriceRange = [240.00, 480.00]
const mockStarRatings = [false, false, true, false, false] // 3 stars

describe("Backend Hotel Filter Unit Tests", () => {
    test("BACKEND_HOTEL_FILTER_UNIT_1: Test filtering by price", () => {
        const priceFilteredList = filterByPrice(mockPriceRange, mockHotelListings)
        const expectedPriceFilteredList = [
            {"id": "0dJR", "price": "300.16", "starRating": 3},
            {"id": "0E35", "price": "450.00", "starRating": 4},
            {"id": "Sr3q", "price": "245.89", "starRating": 2},
            {"id": "Hd39", "price": "356.10", "starRating": 3}
        ]
        expect(priceFilteredList).toEqual(expectedPriceFilteredList)
    })

    test("BACKEND_HOTEL_FILTER_UNIT_2: Test filtering by rating", () => {
        const ratingFilteredList = filterByRating(mockStarRatings, mockHotelListings)
        const expectedRatingFilteredList = [
            {"id": "0CjM", "price": "100.00", "starRating": 3},
            {"id": "00Y3", "price": "500.20", "starRating": 3},
            {"id": "0dJR", "price": "300.16", "starRating": 3},
            {"id": "Hd39", "price": "356.10", "starRating": 3}
        ]
        expect(ratingFilteredList).toEqual(expectedRatingFilteredList)
    })

    test("BACKEND_HOTEL_FILTER_UNIT_3: Test filtering by price & rating", () => {
        const priceFilteredList = filterByPrice(mockPriceRange, mockHotelListings)
        const ratingFilteredList = filterByRating(mockStarRatings, priceFilteredList)
        const expectedRatingFilteredList = [
            {"id": "0dJR", "price": "300.16", "starRating": 3},
            {"id": "Hd39", "price": "356.10", "starRating": 3}
        ]
        expect(ratingFilteredList).toEqual(expectedRatingFilteredList)
    })
})

describe("Backend Hotel Filter Integration Tests", () => {
    test("BACKEND_HOTEL_FILTER_INT_1: Test HotelFilter function with valid inputs for price", async() => {
        const filterResults = await HotelFilter(mockHotelListings, mockPriceRange, true, mockStarRatings, false)
        const filteredHotels = filterResults.hotels
        const filteredPages = filterResults.pages
        const filteredPriceRange = filterResults.range

        const expectedHotels = [
            {"id": "0dJR", "price": "300.16", "starRating": 3},
            {"id": "0E35", "price": "450.00", "starRating": 4},
            {"id": "Sr3q", "price": "245.89", "starRating": 2},
            {"id": "Hd39", "price": "356.10", "starRating": 3}
        ]
        const expectedPages = 1
        const expectedPriceRange = [240.00, 450.00]

        expect(filteredHotels).toEqual(expectedHotels)
        expect(filteredPages).toEqual(expectedPages)
        expect(filteredPriceRange).toEqual(expectedPriceRange)
    })

    test("BACKEND_HOTEL_FILTER_INT_2: Test HotelFilter function with valid inputs for rating", async() => {
        const filterResults = await HotelFilter(mockHotelListings, mockPriceRange, false, mockStarRatings, true)
        const filteredHotels = filterResults.hotels
        const filteredPages = filterResults.pages
        const filteredPriceRange = filterResults.range

        const expectedHotels = [
            {"id": "0CjM", "price": "100.00", "starRating": 3},
            {"id": "00Y3", "price": "500.20", "starRating": 3},
            {"id": "0dJR", "price": "300.16", "starRating": 3},
            {"id": "Hd39", "price": "356.10", "starRating": 3}
        ]
        const expectedPages = 1
        const expectedPriceRange = [100.00, 510.00]

        expect(filteredHotels).toEqual(expectedHotels)
        expect(filteredPages).toEqual(expectedPages)
        expect(filteredPriceRange).toEqual(expectedPriceRange)
    })

    test("BACKEND_HOTEL_FILTER_INT_3: Test HotelFilter function with valid inputs for both price and rating", async() => {
        const filterResults = await HotelFilter(mockHotelListings, mockPriceRange, true, mockStarRatings, true)
        const filteredHotels = filterResults.hotels
        const filteredPages = filterResults.pages
        const filteredPriceRange = filterResults.range

        const expectedHotels = [
            {"id": "0dJR", "price": "300.16", "starRating": 3},
            {"id": "Hd39", "price": "356.10", "starRating": 3}
        ]
        const expectedPages = 1
        const expectedPriceRange = [300.00, 360.00]

        expect(filteredHotels).toEqual(expectedHotels)
        expect(filteredPages).toEqual(expectedPages)
        expect(filteredPriceRange).toEqual(expectedPriceRange)
    })

    test("BACKEND_HOTEL_FILTER_INT_4: Test HotelFilter function with empty hotelListings input", async() => {
        const filterResults = await HotelFilter([], mockPriceRange, true, mockStarRatings, true)
        const filteredHotels = filterResults.hotels
        const filteredPages = filterResults.pages
        const filteredPriceRange = filterResults.range

        const expectedHotels = []
        const expectedPages = 1
        const expectedPriceRange = [0.00, 0.00]

        expect(filteredHotels).toEqual(expectedHotels)
        expect(filteredPages).toEqual(expectedPages)
        expect(filteredPriceRange).toEqual(expectedPriceRange)
    })

    test("BACKEND_HOTEL_FILTER_INT_5: Test HotelFilter function with empty priceRange input and filterPrice == true", async() => {
        const filterResults = await HotelFilter(mockHotelListings, [], true, mockStarRatings, false)
        const filteredHotels = filterResults.hotels
        const filteredPages = filterResults.pages
        const filteredPriceRange = filterResults.range

        const expectedHotels = []
        const expectedPages = 1
        const expectedPriceRange = [0.00, 0.00]

        expect(filteredHotels).toEqual(expectedHotels)
        expect(filteredPages).toEqual(expectedPages)
        expect(filteredPriceRange).toEqual(expectedPriceRange)
    })

    test("BACKEND_HOTEL_FILTER_INT_6: Test HotelFilter function with empty starRatings input and filterRating == true", async() => {
        const filterResults = await HotelFilter(mockHotelListings, mockPriceRange, false, [], true)
        const filteredHotels = filterResults.hotels
        const filteredPages = filterResults.pages
        const filteredPriceRange = filterResults.range

        const expectedHotels = []
        const expectedPages = 1
        const expectedPriceRange = [0.00, 0.00]

        expect(filteredHotels).toEqual(expectedHotels)
        expect(filteredPages).toEqual(expectedPages)
        expect(filteredPriceRange).toEqual(expectedPriceRange)
    })

    test("BACKEND_HOTEL_FILTER_INT_7: Test HotelFilter function with valid inputs but empty output", async() => {
        const mockPriceRange2 = [240.00, 400.00]
        const mockStarRatings2 = [false, false, false, true, false] // 4 stars
        
        const filterResults = await HotelFilter(mockHotelListings, mockPriceRange2, true, mockStarRatings2, true)
        const filteredHotels = filterResults.hotels
        const filteredPages = filterResults.pages
        const filteredPriceRange = filterResults.range

        const expectedHotels = []
        const expectedPages = 1
        const expectedPriceRange = [0.00, 0.00]

        expect(filteredHotels).toEqual(expectedHotels)
        expect(filteredPages).toEqual(expectedPages)
        expect(filteredPriceRange).toEqual(expectedPriceRange)
    })
})