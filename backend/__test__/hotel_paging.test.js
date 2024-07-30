const Paging = require('../../frontend/src/controllers/Paging')

const mockListings = [
    {"id":"00Y3","name":"Berlinlux Apartments City","rating":"3.2","starRating":3, "price":"680.91"},
    {"id":"0CHr","name":"Alex Hotel","rating":"3.9","starRating":3, "price":"282.63"},
    {"id":"0CjM","name":"Amc Apartments Ku Damm","rating":"4.2","starRating":4, "price":"254.60"},
    {"id":"0DaK","name":"Berlin Marriott Hotel","rating":"4.5","starRating":4, "price":"358.58"},
    {"id":"0dJR","name":"WAIZENEGGER PENSION","rating":"3.9","starRating":3, "price":"982.67"},
    {"id":"0E35","name":"RockChair Apartment Greifswalder Straße","rating":"0.0","starRating":0, "price":"337.93"},
    {"id":"0gtn","name":"Lindsays Schlafmeile","rating":"0.0","starRating":0, "price":"135.88"},
    {"id":"0Hy2","name":"Ibis Budget Berlin City Potsdamer Platz","rating":"3.2","starRating":3, "price":"897.32"},
    {"id":"0J7S","name":"Luxury Appartement City Center West","rating":"3.2","starRating":3, "price":"1828.24"},
    {"id":"0JSi","name":"Filmhotel Lili Marleen","rating":"4.0","starRating":4, "price":"846.65"},
    {"id":"0n3E","name":"Ballhaus Berlin Hostel","rating":"4.0","starRating":4, "price":"1173.64"},
    {"id":"0QD9","name":"Golden Tulip Berlin Hotel Hamburg","rating":"4.1","starRating":4, "price":"1101.65"},
    {"id":"0Sqe","name":"Hotel Pension Arta","rating":"3.2","starRating":3, "price":"915.65"},
    {"id":"0tVa","name":"Eckstein","rating":"3.2","starRating":3, "price":"382.05"},
    {"id":"0Vv7","name":"Hotel & Hostel Friedrichshain","rating":"3.5","starRating":3, "price":"256.27"}
]

describe("Backend Hotel List Paging Unit Tests", () => {
    test("BACKEND_HOTEL_LIST_PAGING_UNIT_1: Test Paging function to generate page 1 of mock listings", async() => {
        paginatedListings1 = await Paging(mockListings, 1)
        expectedPaginatedListings1 = [
            {"id":"00Y3","name":"Berlinlux Apartments City","rating":"3.2","starRating":3, "price":"680.91"},
            {"id":"0CHr","name":"Alex Hotel","rating":"3.9","starRating":3, "price":"282.63"},
            {"id":"0CjM","name":"Amc Apartments Ku Damm","rating":"4.2","starRating":4, "price":"254.60"},
            {"id":"0DaK","name":"Berlin Marriott Hotel","rating":"4.5","starRating":4, "price":"358.58"},
            {"id":"0dJR","name":"WAIZENEGGER PENSION","rating":"3.9","starRating":3, "price":"982.67"},
            {"id":"0E35","name":"RockChair Apartment Greifswalder Straße","rating":"0.0","starRating":0, "price":"337.93"},
            {"id":"0gtn","name":"Lindsays Schlafmeile","rating":"0.0","starRating":0, "price":"135.88"},
            {"id":"0Hy2","name":"Ibis Budget Berlin City Potsdamer Platz","rating":"3.2","starRating":3, "price":"897.32"},
            {"id":"0J7S","name":"Luxury Appartement City Center West","rating":"3.2","starRating":3, "price":"1828.24"},
            {"id":"0JSi","name":"Filmhotel Lili Marleen","rating":"4.0","starRating":4, "price":"846.65"}
        ]
        expect(paginatedListings1).toEqual(expectedPaginatedListings1)
    })

    test("BACKEND_HOTEL_LIST_PAGING_UNIT_2: Test Paging function to generate page 2 of mock listings", async() => {
        paginatedListings2 = await Paging(mockListings, 2)
        expectedPaginatedListings2 = [
            {"id":"0n3E","name":"Ballhaus Berlin Hostel","rating":"4.0","starRating":4, "price":"1173.64"},
            {"id":"0QD9","name":"Golden Tulip Berlin Hotel Hamburg","rating":"4.1","starRating":4, "price":"1101.65"},
            {"id":"0Sqe","name":"Hotel Pension Arta","rating":"3.2","starRating":3, "price":"915.65"},
            {"id":"0tVa","name":"Eckstein","rating":"3.2","starRating":3, "price":"382.05"},
            {"id":"0Vv7","name":"Hotel & Hostel Friedrichshain","rating":"3.5","starRating":3, "price":"256.27"}
        ]
        expect(paginatedListings2).toEqual(expectedPaginatedListings2)
    })

    test("BACKEND_HOTEL_LIST_PAGING_UNIT_3: Test Paging function to generate page 1 of empty mock listings", async() => {
        paginatedListings = await Paging([], 1)
        expectedPaginatedListings = []
        expect(paginatedListings).toEqual(expectedPaginatedListings)
    })

    test("BACKEND_HOTEL_LIST_PAGING_UNIT_4: Test Paging function with invalid page number (page = 0)", async() => {
        paginatedListings = await Paging(mockListings, 0)
        expectedPaginatedListings = [
            {"id":"00Y3","name":"Berlinlux Apartments City","rating":"3.2","starRating":3, "price":"680.91"},
            {"id":"0CHr","name":"Alex Hotel","rating":"3.9","starRating":3, "price":"282.63"},
            {"id":"0CjM","name":"Amc Apartments Ku Damm","rating":"4.2","starRating":4, "price":"254.60"},
            {"id":"0DaK","name":"Berlin Marriott Hotel","rating":"4.5","starRating":4, "price":"358.58"},
            {"id":"0dJR","name":"WAIZENEGGER PENSION","rating":"3.9","starRating":3, "price":"982.67"},
            {"id":"0E35","name":"RockChair Apartment Greifswalder Straße","rating":"0.0","starRating":0, "price":"337.93"},
            {"id":"0gtn","name":"Lindsays Schlafmeile","rating":"0.0","starRating":0, "price":"135.88"},
            {"id":"0Hy2","name":"Ibis Budget Berlin City Potsdamer Platz","rating":"3.2","starRating":3, "price":"897.32"},
            {"id":"0J7S","name":"Luxury Appartement City Center West","rating":"3.2","starRating":3, "price":"1828.24"},
            {"id":"0JSi","name":"Filmhotel Lili Marleen","rating":"4.0","starRating":4, "price":"846.65"}
        ]
        expect(paginatedListings).toEqual(expectedPaginatedListings)
    })

    test("BACKEND_HOTEL_LIST_PAGING_UNIT_5: Test Paging function with invalid page number (page = null)", async() => {
        paginatedListings = await Paging(mockListings, null)
        expectedPaginatedListings = [
            {"id":"00Y3","name":"Berlinlux Apartments City","rating":"3.2","starRating":3, "price":"680.91"},
            {"id":"0CHr","name":"Alex Hotel","rating":"3.9","starRating":3, "price":"282.63"},
            {"id":"0CjM","name":"Amc Apartments Ku Damm","rating":"4.2","starRating":4, "price":"254.60"},
            {"id":"0DaK","name":"Berlin Marriott Hotel","rating":"4.5","starRating":4, "price":"358.58"},
            {"id":"0dJR","name":"WAIZENEGGER PENSION","rating":"3.9","starRating":3, "price":"982.67"},
            {"id":"0E35","name":"RockChair Apartment Greifswalder Straße","rating":"0.0","starRating":0, "price":"337.93"},
            {"id":"0gtn","name":"Lindsays Schlafmeile","rating":"0.0","starRating":0, "price":"135.88"},
            {"id":"0Hy2","name":"Ibis Budget Berlin City Potsdamer Platz","rating":"3.2","starRating":3, "price":"897.32"},
            {"id":"0J7S","name":"Luxury Appartement City Center West","rating":"3.2","starRating":3, "price":"1828.24"},
            {"id":"0JSi","name":"Filmhotel Lili Marleen","rating":"4.0","starRating":4, "price":"846.65"}
        ]
        expect(paginatedListings).toEqual(expectedPaginatedListings)
    })

    test("BACKEND_HOTEL_LIST_PAGING_UNIT_6: Test Paging function with invalid page number (page number < page limit)", async() => {
        paginatedListings = await Paging(mockListings, 5)
        expectedPaginatedListings = [
            {"id":"0n3E","name":"Ballhaus Berlin Hostel","rating":"4.0","starRating":4, "price":"1173.64"},
            {"id":"0QD9","name":"Golden Tulip Berlin Hotel Hamburg","rating":"4.1","starRating":4, "price":"1101.65"},
            {"id":"0Sqe","name":"Hotel Pension Arta","rating":"3.2","starRating":3, "price":"915.65"},
            {"id":"0tVa","name":"Eckstein","rating":"3.2","starRating":3, "price":"382.05"},
            {"id":"0Vv7","name":"Hotel & Hostel Friedrichshain","rating":"3.5","starRating":3, "price":"256.27"}
        ]
        expect(paginatedListings).toEqual(expectedPaginatedListings)
    })
})