import { format, addDays } from 'date-fns';

describe('Home Page Test', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  // Test for correct Logo displayed
  it('Contains correct logo image', () => {
    cy.get('[data-test="Ascenda"]').should('have.attr', 'src', '/images/logo_ascenda.png')
  })

  // Test that register button exist 
  it('Contains correct register text', () => {
    cy.get('[data-test="registerText"]').should('contain.text', 'Register')
    cy.get('[data-test="registerText"]').click()
    cy.url().should('include', '/register')
    cy.visit('/') 
  })  

  // Test that welcome message exist 
  it('Contains correct welcome text', () => {
    cy.get('[data-test="welcomeMsg"]').should('contain.text', 'Welcome, ')
  })  

  // Test the dropdown menu
  it('Opens dropdown menu and checks options', () => {
    cy.get('[data-test="welcomeMsg"] .dropdownButton').click()

    // Check if dropdown is visible
    cy.get('.dropdownContent').should('be.visible')

    // Check if each option is clickable
    const options = [
      { text: 'Log in', path: '/login' },
      { text: 'Account info.', path: '/account' },
      { text: 'Bookings', path: '/bookings' },
      { text: 'Log out', path: '/' }
    ];

    options.forEach(option => {
      cy.get('.dropdownItem').contains(option.text).click()
      cy.url().should('include', option.path)
      cy.visit('/') // Go back to home page for the next iteration
      cy.get('[data-test="welcomeMsg"] .dropdownButton').click() // Re-open the dropdown
    });

    cy.get('[data-test="welcomeMsg"] .dropdownButton').click() // close the dropdown after last iteration
  });

  // Test that Hotel text exist 
  it('Contains correct hotel text', () => {
    cy.get('[data-test="hotelsOption"]').should('contain.text', 'Hotels')
  })  

  // Test that Flight text exist 
  it('Contains correct flight text', () => {
    cy.get('[data-test="flightsOption"]').should('contain.text', 'Flights')
  })  

  // Test that Car text exist 
  it('Contains correct Car text', () => {
    cy.get('[data-test="CarsOption"]').should('contain.text', 'Cars')
  })  
  
  // Test that header title text exist 
  it('Contains correct Header Title', () => {
    cy.get('[data-test="headerTitletext"]').should('contain.text', 'Experience the world your way with Travel with Ascenda.')
  })  

  // Test that header decscription text exist 
  it('Contains correct Header Description', () => {
    cy.get('[data-test="headerDesctext"]').should('contain.text', 'Enjoy exclusive travel deals using Ascenda.')
  }) 

  // Test that login button exist 
  it('Contains correct login text', () => {
    cy.get('[data-test="headerLogin"]').should('contain.text', 'Log in')
    cy.get('[data-test="headerLogin"]').click()
    cy.url().should('include', '/login')
    cy.visit('/') 
  }) 

  // Test destination search with correct input
  it('Displays suggestions with NO typo', () => {
    cy.get('[data-test="destinationSearch"] .headerSearchInput')
      .type('Singapore', { delay: 100 }) // Type with a delay of 100ms per character to give autosuggest time to load 
      .should('have.value', 'Singapore'); // Ensure the input value is correctly set

    cy.wait(1000);

    // Logging to check if suggestions container is present
    cy.get('.autosuggestSuggestionsContainer').should('exist'); 

    // Click on the first suggestion and verify the input value
    cy.get('.autosuggestSuggestion')
      .first()
      .invoke('text')
      .then((suggestion) => {
        cy.log('First suggestion:', suggestion);
        cy.get('.autosuggestSuggestion').first().click();
        cy.get('[data-test="destinationSearch"] .headerSearchInput').should('have.value', suggestion);
      });
  });

  // Test destination search with wrong input
  it('Displays suggestions with typo', () => {
    cy.get('[data-test="destinationSearch"] .headerSearchInput')
      .type('Singpore', { delay: 100 }) // Type with a delay of 100ms per character to give autosuggest time to load 
      .should('have.value', 'Singpore'); // Ensure the input value is correctly set

    cy.wait(1000);

    // Logging to check if suggestions container is present
    cy.get('.autosuggestSuggestionsContainer').should('exist'); 

    // Click on the first suggestion and verify the input value
    cy.get('.autosuggestSuggestion')
      .first()
      .invoke('text')
      .then((suggestion) => {
        cy.log('First suggestion:', suggestion);
        cy.get('.autosuggestSuggestion').first().click();
        cy.get('[data-test="destinationSearch"] .headerSearchInput').should('have.value', suggestion);
      });
  });

  // Test that clicking on dateSearch launches date picker and selects date range
  it('Displays the date picker and selects a date range', () => {
    const startDate = new Date();
    const endDate = addDays(new Date(), 5);

    cy.log(`Expected start date: ${format(startDate, "dd/MM/yyyy")}`);
    cy.log(`Expected end date: ${format(endDate, "dd/MM/yyyy")}`);

    cy.get('[data-test="dateSearch"] .headerSearchText').click();
    
    // Select the next day as the start date
    cy.get('.rdrDayNumber span')
      .contains(startDate.getDate())
      .click({ force: true });

    // Select 5 days later as the end date
    cy.get('.rdrDayNumber span')
      .contains(endDate.getDate())
      .click({ force: true });

    cy.get('body').click(0, 0);

    // Verify that the selected date range is reflected in the input field
    cy.get('[data-test="dateSearch"] .headerSearchText')
      .should('contain', `${format(startDate, "dd/MM/yyyy")} to ${format(endDate, "dd/MM/yyyy")}`);
  });

  it('Displays the guest info dropdown and adjusts adult numbers', () => {
    cy.get('[data-test="guestInfoSearch"] .headerSearchText').click();

    // Verify that the dropdown is visible
    cy.get('.options').should('be.visible');

    // Increase adult numbers
    cy.get('[data-test="adultsIncrease"]').click();
    cy.get('[data-test="adultsNum"]').should('contain.text', '2'); // Assuming the initial value is 1

    // Decrease adult numbers, should not go below 1
    cy.get('[data-test="adultsDecrease"]').click();
    cy.get('[data-test="adultsNum"]').should('contain.text', '1');
  });

  it('Displays the guest info dropdown and adjusts children numbers', () => {
    cy.get('[data-test="guestInfoSearch"] .headerSearchText').click();

    // Verify that the dropdown is visible
    cy.get('.options').should('be.visible');

    // Increase adult numbers
    cy.get('[data-test="childrenIncrease"]').click();
    cy.get('[data-test="childrenNum"]').should('contain.text', '1'); // Assuming the initial value is 1

    // Decrease adult numbers, should not go below 1
    cy.get('[data-test="childrenDecrease"]').click();
    cy.get('[data-test="childrenNum"]').should('contain.text', '0');
  });

  it('Displays the guest info dropdown and adjusts room numbers', () => {
    cy.get('[data-test="guestInfoSearch"] .headerSearchText').click();

    // Verify that the dropdown is visible
    cy.get('.options').should('be.visible');

    // Increase adult numbers
    cy.get('[data-test="roomsIncrease"]').click();
    cy.get('[data-test="roomsNum"]').should('contain.text', '2'); // Assuming the initial value is 1

    // Decrease adult numbers, should not go below 1
    cy.get('[data-test="roomsDecrease"]').click();
    cy.get('[data-test="roomsNum"]').should('contain.text', '1');
  });

  it('Displays the guest info dropdown and adjusts guest numbers', () => {
    cy.get('[data-test="guestInfoSearch"] .headerSearchText').click();

    // Verify that the dropdown is visible
    cy.get('.options').should('be.visible');

    // Increase adult numbers
    cy.get('[data-test="adultsIncrease"]').click();
    cy.get('[data-test="adultsNum"]').should('contain.text', '2'); 

    // Increase children numbers
    cy.get('[data-test="childrenIncrease"]').click();
    cy.get('[data-test="childrenNum"]').should('contain.text', '1');

    // Increase room numbers
    cy.get('[data-test="roomsIncrease"]').click();
    cy.get('[data-test="roomsNum"]').should('contain.text', '2');

    cy.get('body').click(0, 0);
  });

  // Test that search button exist and works
  it('Contains search button and works', () => {
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

    cy.get('[data-test="searchTest"]').click();
    cy.visit('/hotels/{destinationSearch}/{startDate}/{endDate}/{guestInfoSearch}/');
    cy.visit('/');
  });

})