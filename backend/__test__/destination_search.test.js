const didYouMean = require('didyoumean2').default
const destinationSearch = require("../routes/destination_search")
const getDestinationId = destinationSearch.getDestinationId
const inputText = "sigapore"
const destinationText = "Istana, Singapore"
const expectedId = "RsBU"

// Mock destinations.json
const destinations = [
    {"term": "Rome, Italy"},
    {"term": "Istana, Singapore"},
    {"term": "Berlin, Germany"},
    {"term": "Sentosa, Singapore"}
]

// Mock autocorrect function
const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
        return [];
      }
  
    // Get the terms from the destinations and apply didYouMean2
    const terms = destinations.map((dest) => dest.term);
    const suggestions = didYouMean(inputValue, terms, {
    returnType: "all-sorted-matches",
    });

    return suggestions
    .map((suggestion) =>
        destinations.find(
        (dest) =>
            dest.term && dest.term.toLowerCase() === suggestion.toLowerCase()
        )
    )
    .filter(Boolean); // Filter out any undefined results
}
const inputText = "sigapore"
const destinationText = "Istana, Singapore"
const expectedId = "RsBU"

// Mock destinations.json
const destinations = [
    {"term": "Rome, Italy"},
    {"term": "Istana, Singapore"},
    {"term": "Berlin, Germany"},
    {"term": "Sentosa, Singapore"}
]

// Mock autocorrect function
const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
        return [];
      }
  
    // Get the terms from the destinations and apply didYouMean2
    const terms = destinations.map((dest) => dest.term);
    const suggestions = didYouMean(inputValue, terms, {
    returnType: "all-sorted-matches",
    });

    return suggestions
    .map((suggestion) =>
        destinations.find(
        (dest) =>
            dest.term && dest.term.toLowerCase() === suggestion.toLowerCase()
        )
    )
    .filter(Boolean); // Filter out any undefined results
}

describe("Backend Destination Search Unit Test", () => {
    test("BACKEND_DEST_SEARCH_UNIT_1: Test retrieving destination id with valid destination text", async() => {
        const id = await getDestinationId(destinationText)
        expect(id).toBe(expectedId)
    }, 10000)

    test("BACKEND_DEST_SEARCH_UNIT_2: Test retrieving destination id with invalid destination text", async() => {
        const invalid_destinationText = "Singapore";
        const id = await getDestinationId(invalid_destinationText)
        expect(id).toBe(null)
    }, 10000)

    test("BACKEND_DEST_SEARCH_UNIT_3: Test autosuggest function provided by didyoumean2 library using invalid input text", async() => {
        const output = getSuggestions(inputText)
        const expectedOutput = [{'term': 'Istana, Singapore'}, {'term': 'Sentosa, Singapore'}]
        expect(output).toEqual(expectedOutput)
    })
})

describe("Backend Destination Search Integration Test", () => {
    test("BACKEND_DEST_SEARCH_INT_1: Test destination search route with valid destination text", async() => {
        const res = await fetch(`http://localhost:5000/destination_search/${destinationText}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        //console.log(res)
        const text = await res.text();
        //console.log(text)
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
        //console.log(text)
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