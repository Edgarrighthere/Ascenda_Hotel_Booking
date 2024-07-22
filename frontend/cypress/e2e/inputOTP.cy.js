describe('Verify OTP Page Test', () => {
    beforeEach(() => {
      cy.visit('/inputOTP')
    })

    // Test that OTP title exist 
    it('Contains correct OTP text', () => {
        cy.get('[data-test="otpTitle"]').should('contain.text', '2FA Authentication')
    }) 

    // Test that OTP instruction exist 
    it('Contains correct OTP instruction text', () => {
        cy.get('[data-test="otpTitle1"]').should('contain.text', 'Please check your email for the OTP sent.')
    }) 

    // Test that 6 input boxes exist 
    it('Contains 6 input boxes for OTP', () => {
        cy.get('.otpInputContainer input')
            .should('have.length', 6);
    });

    // Test that "Didn't receive code" text exists
    it('Contains "Didn\'t receive code?" text', () => {
        cy.get('.resendContainer').should('contain.text', "Didn't receive code?")
    })

    // Test that the "Resend code" button exists and handles invalid email case
    it('Contains Resend code button and handles error for invalid email', () => {
        cy.intercept('POST', '/resend_otp', {
            statusCode: 500,
            body: {
                success: false,
                message: 'Invalid email.'
            }
        }).as('resendOtpRequest')

        cy.get('.resendButton').click()

        // Wait for the error message to appear
        cy.get('[data-test="otpContainer"]').should('contain.text', 'Invalid email.')
    })

    // Test that verify OTP button exist 
    it('Contains Verify OTP button', () => {
        cy.get('[data-test="verifyOTPBtn"]').should('contain.text', 'Verify OTP')
        cy.get('[data-test="verifyOTPBtn"]').click()
        cy.get('[data-test="otpContainer"]').should('contain.text', 'OTP must be 6 digits.')
    })    

    // Test case to verify OTP and show error message for invalid OTP
    it('Displays error message for invalid OTP', () => {
        cy.get('.otpInputContainer input').each(($input) => {
            cy.wrap($input).type('0');
        });

        // Mock the API response to simulate an invalid OTP
        cy.intercept('POST', 'http://localhost:5000/verify_otp', {
            statusCode: 500,
            body: {
                success: false,
                message: 'Invalid OTP. Please make sure you entered the correct OTP sent.'
            }
        }).as('verifyOtpRequest');

        cy.get('[data-test="verifyOTPBtn"]').click();

        // Wait for the mock request to complete
        cy.wait('@verifyOtpRequest');

        // Verify that the error message is displayed
        cy.get('.error')
            .should('contain.text', 'Invalid OTP. Please make sure you entered the correct OTP sent.');
    });

    // Test case to verify correct OTP and show success message
    it('Displays success message for correct OTP', () => {
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
    });
})