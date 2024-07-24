import { format, addDays } from 'date-fns';

describe('Room Component Test', () => {
    it('Check for room component in Hotel page', () => {
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

        cy.wait(10000); // wait to fetch for info from API

        // Check that Categories component exists
        cy.get('[data-test="rooms"]').should('exist');

    });
});