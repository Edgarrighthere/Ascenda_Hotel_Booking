const destinationId = "tOik"
const checkin = "2024-07-22"
const checkout = "2024-07-23"
const guests = "1"

describe("Backend Hotel Search API Unit Test", () => {
    test("BACKEND_HOTEL_SEARCH_API_1: Testing Pricing API with valid inputs", async() => {
        const res = await fetch(`http://localhost:5000/hotel_search/${destinationId}/${checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });
        const json = await res.json()
        const hotels_notempty = json.length > 0;
        expect(hotels_notempty).toEqual(true); // hotels array should not be empty
    }, 15000)

    test("BACKEND_HOTEL_SEARCH_API_2: Testing Pricing API with invalid inputs (destination id does not exist)", async() => {
        // even if completed is true, hotels array should be empty
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

    test("BACKEND_HOTEL_SEARCH_API_3: Testing Pricing API with invalid inputs (check-in date < current date)", async() => {
        // even if completed is true, hotels array should be empty
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

    test("BACKEND_HOTEL_SEARCH_API_4: Testing Pricing API with invalid inputs (check-in date <= check-out date)", async() => {
        // even if completed is true, hotels array should be empty
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

    test("BACKEND_HOTEL_SEARCH_API_5: Testing Pricing API with invalid inputs (zero guests)", async() => {
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

    test("BACKEND_HOTEL_SEARCH_API_6: Testing Listing API with valid inputs but no possible listings", async() => {
        const new_destinationId = "aq3t"
        const new_guests = "3|3|3|3|3|3|3|3|3|3"
        const res = await fetch(`http://localhost:5000/hotel_search/${new_destinationId}/${checkin}/${checkout}/${new_guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        });
        const text = await res.text();
        const json = JSON.parse(text);

        expect(res.status).toEqual(400);
        expect(json.message).toBe("No hotel listings found.")
    }, 10000)

})