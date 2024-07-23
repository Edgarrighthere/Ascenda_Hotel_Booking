const destinationSearch = require("../routes/destination_search")
const getDestinationId = destinationSearch.getDestinationId
const destinationText = "Istana, Singapore";
const expectedId = "RsBU";

describe("Backend Destination Search Unit Test", () => {
    test("BACKEND_DEST_SEARCH_UNIT_1: Test retrieving destination id with valid destination text", async() => {
        const id = getDestinationId(destinationText)
        expect(id).toBe(expectedId)
    }, 10000)

    test("BACKEND_DEST_SEARCH_UNIT_2: Test retrieving destination id with invalid destination text", async() => {
        const invalid_destinationText = "Singapore";
        const id = getDestinationId(destinationText)
        expect(id).toBe(null)
    }, 10000)
})

describe("Backend Destination Search Integration Test", () => {
    test("BACKEND_DEST_SEARCH_INT_1: Test destination search route with valid destination text", async() => {
        const res = await fetch(`http://localhost:5000/destination_search/`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text();
        expect(text).toBe(expectedId)
    }, 10000)

    test("BACKEND_DEST_SEARCH_INT_2: Test retrieving destination id with invalid destination text", async() => {
        const invalid_destinationText = "Singapore";
        const res = await fetch(`http://localhost:5000/destination_search/${invalid_destinationText}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text();
        const json = JSON.parse(text);

        expect(res.status).toEqual(400);
        expect(json.message).toBe("Invalid Input: Destination name is invalid.")
    }, 10000)

    test("BACKEND_DEST_SEARCH_INT_3: Testing /all in destination search", async() => {
        const res = await fetch(`http://localhost:5000/destination_search/`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        const text = await res.text();
        const json = JSON.parse(text);
        expect(json.length).toBe(74280);
    }, 10000)
})