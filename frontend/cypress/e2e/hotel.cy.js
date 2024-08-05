import { format, addDays } from 'date-fns';

describe('Hotel Page Test', () => {
    it('Check for components in Hotel page', () => {
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
        const endDate = addDays(new Date(), 2);

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
        cy.wait(5000); // wait to fetch for info from API

        // Click on first "see availability" button to go to that Hotel page
        cy.get('.searchItem').first().within(() => {
            cy.get('.siCheckButton').should('exist').click();
        });

        cy.wait(10000); // wait to fetch for info from API

        // Check that Hotel Title exist
        cy.get('.hotelTitle').should('exist');

        // Check that "book now" button exist
        cy.get('.bookNow').should('exist').should('contain.text', 'Book Now!');

        // Check that Hotel address exist
        cy.get('.hotelAddress').should('exist');

        // Check that Hotel distance from center exist
        cy.get('.hotelDistance').should('exist');

        // Check that Hotel price highlight from center exist
        cy.get('.hotelPriceHighlight').should('exist');

        // Check that Hotel images exist
        cy.get('.hotelImages').should('exist');

        // Click on the first image to open the slider
        cy.get('.hotelImgWrapper').first().click();
        cy.get('.slider').should('exist'); // Check that slider is opened

        // Click right arrow to move to next image
        cy.get('[data-test="arrowRight"]').should('be.visible').click();

        // Click left arrow to move to previous image
        cy.get('[data-test="arrowLeft"]').should('be.visible').click();
    
        // Click close cross to close the slider
        cy.get('.close').should('be.visible').click();

        // Check that Hotel Description title exist
        cy.get('[data-test="hotelDescTitle"]').should('exist');

        // Check that Hotel Description exist
        cy.get('.hotelDescription').should('exist');

        // Check that Hotel Details price exist
        cy.get('.hotelDetailsPrice').should('exist');

        // Check that "book now" button exist
        cy.get('[data-test="bookNow"]').should('exist').should('contain.text', 'Reserve or Book Now!');

        // Check that Trust You Score component exists
        cy.get('[data-test="trustYouScore"]').should('exist');

        // Check that each subcomponent exists within the Trust You Score component
        cy.get('[data-test="trustYouScore"]')
            .should('contain.text', 'Overall')
            .and('contain.text', 'Kaligo Overall')
            .and('contain.text', 'Solo')
            .and('contain.text', 'Couple')
            .and('contain.text', 'Family')
            .and('contain.text', 'Business');

        // Check that Categories component exists
        cy.get('[data-test="categories"]').should('exist');

        // Check that each subcomponent exists within the Categories component
        cy.get('[data-test="categories"]')
            .should('contain.text', 'Overall')
            .and('contain.text', 'Romantic Hotel')
            .and('contain.text', 'Family Hotel')
            .and('contain.text', 'Business Hotel');

        // Check that Categories component exists
        cy.get('[data-test="amenities"]').should('exist');

        // Check that Categories component exists
        cy.get('[data-test="rooms"]').should('exist');

        // Check that Categories component exists
        cy.get('[data-test="maps"]').should('exist');
    });
});