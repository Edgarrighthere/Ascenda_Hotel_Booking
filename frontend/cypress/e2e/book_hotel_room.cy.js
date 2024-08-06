import { format, addDays } from 'date-fns';

describe('Booking Form to redirect to Stripe Component Test', () => {
    it('Check for room component in Hotel page and Booking Form validation', () => {
        // Visit the home page
        cy.visit('/');

        // Submit hotel search form from home page
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
        const endDate = addDays(new Date(), 4);

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

        // Navigate to a specific listings page
        cy.get('[data-test="searchTest"]').click();
        cy.wait(10000); // Wait to fetch info from API

        // Click on the first "see availability" button to go to that Hotel page
        cy.get('.searchItem').first().within(() => {
            cy.get('.siCheckButton').should('exist').click();
        });

        cy.wait(10000); // Wait to fetch info from API

        // Check that the select button exists and go to booking form
        cy.get('.select-button').first().should('exist').click();

        // Check for Booking Form components
        cy.url().should('include', '/booking');
        cy.get('.bookingFormTitle').should('contain.text', 'Enter Your Booking Details');

        // Check all required fields are present
        cy.get('#first_name').should('exist');
        cy.get('#last_name').should('exist');
        cy.get('#email').should('exist');
        cy.get('#phone').should('exist');
        cy.get('#breakfastPackage').should('exist');
        cy.get('#specialRequests').should('exist');

        // Fail scenario: Missing required fields
        cy.get('form').submit();
        cy.get('.error-message').should('contain.text', 'Please fill in all required fields.');

        // Fail scenario: Invalid email
        cy.get('#first_name').type('John');
        cy.get('#last_name').type('Doe');
        cy.get('#email').type('invalid-email');
        cy.get('#phone').type('123456789');
        cy.get('form').submit();
        cy.get('.error-message').should('contain.text', 'Please provide a valid email address.');

        // Fail scenario: Invalid phone number
        cy.get('#email').clear().type('john.doe@example.com');
        cy.get('#phone').clear().type('invalid-phone');
        cy.get('form').submit();
        cy.get('.error-message').should('contain.text', 'Please provide a valid phone number.');

        // Success scenario: All fields entered correctly
        cy.get('#phone').clear().type('+123456789');
        cy.get('#breakfastPackage').check();
        cy.get('#specialRequests').type('No special requests');
        cy.intercept('POST', 'http://localhost:5000/checkout').as('checkout');
        cy.get('form').submit();

        cy.wait('@checkout').then((interception) => {
            assert.isNotNull(interception.response.body.id, 'Checkout session ID should be present');
            // Assuming the Stripe session redirection is mocked for testing
            cy.window().then((win) => {
                const stripe = win.Stripe('pk_test_51PhBxoIrFKgjx0G0vtgffzyhVUjaLsGvvY4JPQXNSypxTUhg2jiluBiMDV6ws23piwulM7jgiI7bgz8NWP1UcSCS00vzlK2lj1');
                stripe.redirectToCheckout = cy.stub().resolves();
            });

            cy.get('.error-message').should('not.exist');
        });
    });
});