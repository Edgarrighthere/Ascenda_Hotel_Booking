import HotelSorting from '../src/controllers/HotelSorting';

// Sample data
const hotelListings = [
    { id: 1, price: 100, rating: 4 },
    { id: 2, price: 200, rating: 5 },
    { id: 3, price: 150, rating: 3 },
];

describe('Frontend List Sorting Unit and Integration Test', () => {
    test('FRONTEND_LIST_SORT_1: Should sort by price (lowest first)', async () => {
        const sortedListings = await HotelSorting(hotelListings, true, false);
        expect(sortedListings).toEqual([
            { id: 1, price: 100, rating: 4 },
            { id: 3, price: 150, rating: 3 },
            { id: 2, price: 200, rating: 5 },
        ]);
    });

    test('FRONTEND_LIST_SORT_2: Should sort by rating (highest first)', async () => {
        const sortedListings = await HotelSorting(hotelListings, false, true);
        expect(sortedListings).toEqual([
            { id: 2, price: 200, rating: 5 },
            { id: 1, price: 100, rating: 4 },
            { id: 3, price: 150, rating: 3 },
        ]);
    });
});