import { format, addDays } from 'date-fns';

describe('Hotel Page Test', () => {
    it('Navigate to listings page with mocked parameters from home search bar, checking for searched hotel components', () => {
        // Visit the home page
        cy.visit('/');

        // submit hotel search form from home page
        cy.get('[data-test="searchTest"]').should('contain.text', 'Search');

        cy.get('[data-test="destinationSearch"] .headerSearchInput')
        .type('Singapore', { delay: 100 })
        .should('have.value', 'Singapore');

        cy.wait(1000);
        cy.get('.autosuggestSuggestionsContainer').should('exist');
        cy.get('.autosuggestSuggestion').first().invoke('text').then((suggestion) => {
        cy.log('First suggestion:', suggestion);
        cy.get('.autosuggestSuggestion').first().click();
        cy.get('[data-test="destinationSearch"] .headerSearchInput').should('have.value', suggestion);
        });

        const startDate = new Date();
        const endDate = addDays(new Date(), 5);

        cy.get('[data-test="dateSearch"] .headerSearchText').click();
        cy.get('.rdrDayNumber span').contains(startDate.getDate()).click({ force: true });
        cy.get('.rdrDayNumber span').contains(endDate.getDate()).click({ force: true });
        cy.get('body').click(0, 0);

        cy.get('[data-test="guestInfoSearch"] .headerSearchText').click();
        cy.get('[data-test="adultsIncrease"]').click();
        cy.get('[data-test="adultsNum"]').should('contain.text', '2');
        cy.get('[data-test="childrenIncrease"]').click();
        cy.get('[data-test="childrenNum"]').should('contain.text', '1');
        cy.get('[data-test="roomsIncrease"]').click();
        cy.get('[data-test="roomsNum"]').should('contain.text', '2');
        cy.get('body').click(0, 0);

        // navigate to a specific listings page
        cy.get('[data-test="searchTest"]').click();
        cy.wait(10000); // wait to fetch for info from API

        // Click on first "see availability" button to go to that Hotel page
        cy.get('.searchItem').first().within(() => {
            cy.get('.siCheckButton').should('exist').click();
        });

        // Check that Hotel Title exist
        cy.get('.hotelTitle').should('exist');

        // Check that "book now" button exist
        cy.get('.bookNow').should('exist');

        // Check that Hotel address exist
        cy.get('.hotelAddress').should('exist');

        // Check that Hotel distance from center exist
        cy.get('.hotelDistance').should('exist');

        // Check that Hotel price highlight from center exist
        cy.get('.hotelPriceHighlight').should('exist');

        // Check that Hotel images exist
        cy.get('.hotelImages').should('exist');

    });
});