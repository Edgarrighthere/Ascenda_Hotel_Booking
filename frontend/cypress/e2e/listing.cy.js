import { format, addDays } from 'date-fns';

describe('Listings Page Test', () => {
    it('Navigate to listings page with mocked parameters from home search bar, checking for components', () => {
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

        // assertion to check for the existence of the map container
        cy.get('[data-test="maps"]').should('exist');

        // assertion to check for the existence of the filter panel
        cy.get('[data-test="filterPanel"]').should('exist');

        // assertion to check for the existence of the search header on filter panel
        cy.get('[data-test="listTitle"]').should('contain.text', 'Search')

        // assertion to check for the existence of the destination header on filter panel
        cy.get('[data-test="listItem1"]').should('contain.text', 'Destination')

        // assertion to check for the existence of the listSearchInput
        cy.get('.listSearchInput').should('exist').click();
        cy.get('.autosuggestSuggestionsContainer').should('exist'); 
        cy.get('body').click(0, 0);

        // assertion to check for the existence of the Check-in Date header on filter panel
        cy.get('[data-test="listItem2"]').should('contain.text', 'Check-in Date')

        // Check if the date picker dropdown opens upon clicking listDatepicker
        cy.get('.listDatepicker').click();
        cy.get('.datePickerOverlay').should('exist');
        cy.get('body').click(0, 0);

        // assertion to check for the existence of the Guest Information header on filter panel
        cy.get('[data-test="listItem3"]').should('contain.text', 'Guest Information')

        // Check for Adult header and button functionality
        cy.get('[data-test="listItem3"] .listOptionItem').eq(0).should('contain.text', 'Adults');
        cy.get('[data-test="adultsNum"]').invoke('text').then((initialAdultCount) => {
            const initialCount = parseInt(initialAdultCount, 10);
            cy.get('[data-test="adultsIncrease"]').click({ force: true });
            cy.get('[data-test="adultsNum"]').should('contain.text', initialCount + 1);
            cy.get('[data-test="adultsDecrease"]').click({ force: true });
            cy.get('[data-test="adultsNum"]').should('contain.text', initialCount);
        });

        // Check for Children header and button functionality
        cy.get('[data-test="listItem3"] .listOptionItem').eq(1).should('contain.text', 'Children');
        cy.get('[data-test="childrenNum"]').invoke('text').then((initialChildrenCount) => {
            const initialCount = parseInt(initialChildrenCount, 10);
            cy.get('[data-test="childrenIncrease"]').click({ force: true });
            cy.get('[data-test="childrenNum"]').should('contain.text', initialCount + 1);
            cy.get('[data-test="childrenDecrease"]').click({ force: true });
            cy.get('[data-test="childrenNum"]').should('contain.text', initialCount);
        });

        // Check for Rooms header and button functionality
        cy.get('[data-test="listItem3"] .listOptionItem').eq(2).should('contain.text', 'Rooms');
        cy.get('[data-test="roomsNum"]').invoke('text').then((initialRoomsCount) => {
            const initialCount = parseInt(initialRoomsCount, 10);
            cy.get('[data-test="roomsIncrease"]').click({ force: true });
            cy.get('[data-test="roomsNum"]').should('contain.text', initialCount + 1);
            cy.get('[data-test="roomsDecrease"]').click({ force: true });
            cy.get('[data-test="roomsNum"]').should('contain.text', initialCount);
        });

        // assertion to check for the existence of the Price per night header on filter panel
        cy.get('[data-test="listItem4"]').should('contain.text', 'Price per night')

        // Check for the range slider for Price per night
        cy.get('.rangeSlider').should('exist');

        // assertion to check for the existence of the Hotel Rating header on filter panel
        cy.get('[data-test="listItem5"]').should('contain.text', 'Hotel Rating')

        // Check for the existence of 5 options for listStarRatingItem
        cy.get('.listStarRatingItem').should('have.length', 5);

        // Check for the title containing "hotel found"
        cy.get('.resultContainer').should('contain.text', 'hotels found');

        // Check for the sortContainer and its button functionality
        cy.get('.sortContainer').should('exist').click();
        cy.get('.sortButton').should('exist').click();
        cy.get('body').click(0, 0);

        // Check that listResult exists and has a length of more than or equal to 1
        cy.get('.listResult').should('exist').and('have.length.greaterThan', 0);

        // Check that pagination exist
        cy.get('.paginationBar').should('exist');
    });
});
