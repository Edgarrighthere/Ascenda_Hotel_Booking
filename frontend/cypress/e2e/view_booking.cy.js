describe('Bookings Page Test', () => {
    it('Testing for successful render of bookings', () => {
        cy.visit("/login");
        cy.get('input[placeholder="Enter your registered email."]').should('exist')
        cy.get('input[placeholder="Enter your registered email."]').type('edgaraw29@gmail.com')
        cy.get('input[placeholder="Enter your registered password."]').should('exist')
        cy.get('input[placeholder="Enter your registered password."]').type('Edgar123!')
        
        cy.get('[data-test="loginBtn"]').should('contain.text', 'Login')
        cy.get('[data-test="loginBtn"]').click()

        // Check for success message
        cy.get('.success').should('contain.text', 'Login successful. Verify with the OTP sent to your registered email...')

        // Check redirection to /inputOTP
        cy.url().should('include', '/inputOTP')
    
        // Mock the API response to simulate the correct OTP verification
        cy.intercept('POST', 'http://localhost:5000/verify_otp', {
            statusCode: 200,
            body: {
                success: true,
                message: 'Valid OTP entered. Redirecting you to home page...'
            }
        }).as('verifyOtpRequest');

        // Type '123456' into each OTP input box
        const otp = '123456';
        const typingDelay = 100; // Delay in milliseconds between keystrokes

        // Type each digit of the OTP with a delay
        cy.get('.otpInputContainer input').each(($input, index) => {
            cy.wrap($input).type(otp[index], { delay: typingDelay });
        });

        cy.get('[data-test="verifyOTPBtn"]').click();

        // Wait for the mock request to complete
        cy.wait('@verifyOtpRequest');

        // Verify that the success message is displayed
        cy.get('.success')
            .should('contain.text', 'Valid OTP entered. Redirecting you to home page...');

        cy.url().should('eq', 'http://localhost:3000/')

        cy.visit('/bookings');

        // Check if booking details are rendered correctly
        cy.get('.bookingsContainer').should('exist');

        // Check the presence of all booking details
        cy.get('.bookingsTitle').should('exist');
        cy.get('[data-testid="name"]').should('exist');
        cy.get('[data-testid="email"]').should('exist');
        cy.get('[data-testid="phone_number"]').should('exist');
        cy.get('[data-testid="destination"]').should('exist');
        cy.get('[data-testid="hotel_name"]').should('exist');
        cy.get('[data-testid="hotel_address"]').should('exist');
        cy.get('[data-testid="room_type"]').should('exist');
        cy.get('[data-testid="roomOnlyPrice"]').should('exist');
        cy.get('[data-testid="breakfastPrice"]').should('exist');
        cy.get('[data-testid="checkInDate"]').should('exist');
        cy.get('[data-testid="checkOutDate"]').should('exist');
        cy.get('[data-testid="durationStay"]').should('exist');
        cy.get('[data-testid="guestInfo"]').should('exist');
        cy.get('[data-testid="cancelPolicy"]').should('exist');
        cy.get('[data-testid="specialRequest"]').should('exist');

        // Check if 'Prev' button is disabled by default
        cy.get('.leftNavButton').should('be.disabled');

        // Check if 'Next' button is enabled if there are multiple bookings
        cy.get('.rightNavButton').should('not.be.disabled');

        // Click on the 'Next' button
        cy.get('.rightNavButton').click();
        cy.get('.leftNavButton').should('not.be.disabled');

        // Click on the 'Prev' button
        cy.get('.leftNavButton').click();
        cy.get('.leftNavButton').should('be.disabled');

        // Click on the home button to return home
        cy.get('.navButtonBookToHome').click();
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('Testing for no bookings scenario', () => {
        cy.intercept('GET', 'http://localhost:5000/complete/bookings', {
            statusCode: 200,
            body: []
        }).as('getNoBookings');

        cy.visit('/bookings');
        cy.wait('@getNoBookings');

        cy.get('[data-testid="noBookings"]').should('exist').and('contain.text', 'No bookings found.');
    });
});

