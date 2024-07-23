describe('Listings Page', () => {
    const mockHotelListings = [
        {
            id: 1,
            name: 'Hotel Mock 1',
            price: 150,
            starRating: 4,
            // other necessary fields...
        },
        {
            id: 2,
            name: 'Hotel Mock 2',
            price: 200,
            starRating: 5,
            // other necessary fields...
        },
    ];

    beforeEach(() => {
        // Mock the API response for hotel listings
        cy.intercept('GET', '/hotel_prices?*', {
            statusCode: 200,
            body: mockHotelListings,
        }).as('getHotelListings');
    });

    it('should display listings with mocked parameters', () => {
        // Visit the specified page with URL parameters
        cy.visit('http://localhost:3000/hotels/RsBU/2024-07-25/2024-07-27/3%7C3/1');

        // Wait for the API call to complete
        cy.wait('@getHotelListings');

        // Verify the listings are displayed
        cy.get('.listResult').within(() => {
            cy.get('.searchItem').should('have.length', mockHotelListings.length);
            cy.get('.searchItem').first().within(() => {
                cy.contains(mockHotelListings[0].name).should('be.visible');
                cy.contains(`$${mockHotelListings[0].price}`).should('be.visible');
                cy.contains(`${mockHotelListings[0].starRating} stars`).should('be.visible');
            });
        });
    });
});
