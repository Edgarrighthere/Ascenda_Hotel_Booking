var HotelSortingController = require('../../frontend/src/controllers/HotelSorting');
const HotelSorting = HotelSortingController.HotelSorting
const sortByPrice = HotelSortingController.sortByPrice
const sortByRating = HotelSortingController.sortByRating

const mockHotelListings = [
    {"id": "0CjM", "price": "100.00", "rating": 3.6},
    {"id": "00Y3", "price": "500.20", "rating": 3.3},
    {"id": "0dJR", "price": "300.16", "rating": 3.9},
    {"id": "0E35", "price": "450.00", "rating": 4.2},
    {"id": "QtQc", "price": "59.80", "rating": 2.9},
    {"id": "7ns4", "price": "616.00", "rating": 4.4},
    {"id": "Sr3q", "price": "245.89", "rating": 2.5},
    {"id": "Hd39", "price": "356.10", "rating": 3.0},
]

describe("Backend Hotel Sorting Unit Tests", () => {
    test("BACKEND_HOTEL_SORT_UNIT_1: Test sorting by price", () => {
        const mockListings = JSON.parse(JSON.stringify(mockHotelListings))
        const sortedPriceListings = sortByPrice(mockListings)
        const expectedSortedPriceListings = [
            {"id": "QtQc", "price": "59.80", "rating": 2.9},
            {"id": "0CjM", "price": "100.00", "rating": 3.6},
            {"id": "Sr3q", "price": "245.89", "rating": 2.5},
            {"id": "0dJR", "price": "300.16", "rating": 3.9},
            {"id": "Hd39", "price": "356.10", "rating": 3.0},
            {"id": "0E35", "price": "450.00", "rating": 4.2},
            {"id": "00Y3", "price": "500.20", "rating": 3.3},
            {"id": "7ns4", "price": "616.00", "rating": 4.4},
        ]
        expect(sortedPriceListings).toEqual(expectedSortedPriceListings)
    })

    test("BACKEND_HOTEL_SORT_UNIT_2: Test sorting by rating", () => {
        const mockListings = JSON.parse(JSON.stringify(mockHotelListings))
        const sortedRatingListings = sortByRating(mockListings)
        const expectedSortedRatingListings = [
            {"id": "7ns4", "price": "616.00", "rating": 4.4},
            {"id": "0E35", "price": "450.00", "rating": 4.2},
            {"id": "0dJR", "price": "300.16", "rating": 3.9},
            {"id": "0CjM", "price": "100.00", "rating": 3.6},
            {"id": "00Y3", "price": "500.20", "rating": 3.3},
            {"id": "Hd39", "price": "356.10", "rating": 3.0},
            {"id": "QtQc", "price": "59.80", "rating": 2.9},
            {"id": "Sr3q", "price": "245.89", "rating": 2.5},
        ]
        expect(sortedRatingListings).toEqual(expectedSortedRatingListings)
    })
})

describe("Backend Hotel Sorting Integration Tests", () => {
    test("BACKEND_HOTEL_SORT_INT_1: Test HotelSorting function with valid inputs to sort by price", async() => {
        const mockListings = JSON.parse(JSON.stringify(mockHotelListings))
        const sortedPriceListings = await HotelSorting(mockListings, true, false)
        const expectedSortedPriceListings = [
            {"id": "QtQc", "price": "59.80", "rating": 2.9},
            {"id": "0CjM", "price": "100.00", "rating": 3.6},
            {"id": "Sr3q", "price": "245.89", "rating": 2.5},
            {"id": "0dJR", "price": "300.16", "rating": 3.9},
            {"id": "Hd39", "price": "356.10", "rating": 3.0},
            {"id": "0E35", "price": "450.00", "rating": 4.2},
            {"id": "00Y3", "price": "500.20", "rating": 3.3},
            {"id": "7ns4", "price": "616.00", "rating": 4.4},
        ]
        expect(sortedPriceListings).toEqual(expectedSortedPriceListings)
    })

    test("BACKEND_HOTEL_SORT_INT_2: Test HotelSorting function with valid inputs to sort by rating", async() => {
        const mockListings = JSON.parse(JSON.stringify(mockHotelListings))
        const sortedRatingListings = await HotelSorting(mockListings, false, true)
        const expectedSortedRatingListings = [
            {"id": "7ns4", "price": "616.00", "rating": 4.4},
            {"id": "0E35", "price": "450.00", "rating": 4.2},
            {"id": "0dJR", "price": "300.16", "rating": 3.9},
            {"id": "0CjM", "price": "100.00", "rating": 3.6},
            {"id": "00Y3", "price": "500.20", "rating": 3.3},
            {"id": "Hd39", "price": "356.10", "rating": 3.0},
            {"id": "QtQc", "price": "59.80", "rating": 2.9},
            {"id": "Sr3q", "price": "245.89", "rating": 2.5},
        ]
        expect(sortedRatingListings).toEqual(expectedSortedRatingListings)
    })

    test("BACKEND_HOTEL_SORT_INT_3: Test HotelSorting function with empty hotelListings input", async() => {
        const mockListings = []
        const sortedListings = await HotelSorting(mockListings, true, false)
        const expectedSortedListings = []
        expect(sortedListings).toEqual(expectedSortedListings)
    })

    test("BACKEND_HOTEL_SORT_INT_4: Test HotelSorting function with non-empty hotelListings but sortPrice and sortRating are both true", async() => {
        const mockListings = JSON.parse(JSON.stringify(mockHotelListings))
        const sortedListings = await HotelSorting(mockListings, true, true)
        const expectedSortedListings = []
        expect(sortedListings).toEqual(expectedSortedListings)
    })

    test("BACKEND_HOTEL_SORT_INT_5: Test HotelSorting function with non-empty hotelListings but sortPrice and sortRating are both false", async() => {
        const mockListings = JSON.parse(JSON.stringify(mockHotelListings))
        const sortedListings = await HotelSorting(mockListings, false, false)
        const expectedSortedListings = []
        expect(sortedListings).toEqual(expectedSortedListings)
    })
})