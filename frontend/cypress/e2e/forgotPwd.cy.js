describe('Forgot Password Page Test', () => {
    beforeEach(() => {
      cy.visit('/forgotPassword')
    })

    // Test that Forgot Password title exist 
    it('Contains correct Forgot Password text', () => {
        cy.get('[data-test="forgotPwdTitle"]').should('contain.text', 'Forgot Password')
    }) 

    // Test that email input field exists and can be typed into
    it('Contains email input field and can type email', () => {
        cy.get('input[placeholder="Enter your registered email."]').should('exist')
        cy.get('input[placeholder="Enter your registered email."]').type('test@example.com')
        cy.get('input[placeholder="Enter your registered email."]').should('have.value', 'test@example.com')
    })

    // Test that send reset password button exist 
    it('Contains send reset password button', () => {
        cy.get('[data-test="forgotPwdBtn"]').should('contain.text', 'Send Reset Password Email')
        cy.get('[data-test="forgotPwdBtn"]').click()
        cy.get('[data-test="forgotPwdContainer"]').should('contain.text', 'Invalid email. Please try again.')
    })    

    // Test that all inputs are filled correctly
    it('Displays success message and mocks email upon successful button click', () => {
        cy.get('input[placeholder="Enter your registered email."]').type('test@test.com')
    
        // Intercept the network request for sending the forgot password email
        cy.intercept('POST', '/forgot-password', (req) => {
            req.reply({
                statusCode: 200,
                body: {
                    message: 'Check your email for instructions to reset your password.',
                    emailContent: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.
                                   Please click on the following link, or paste this into your browser to complete the process:
                                   http://localhost:3000/resetPassword/your-token-here
                                   If you did not request this, please ignore this email and your password will remain unchanged.`
                }
            });
        }).as('resetPwdRequest')
    
        cy.get('[data-testid="forgotPwdBtn"]').click()
    
        // Wait for the mocked request to complete
        cy.wait('@resetPwdRequest').then((interception) => {
        // Verify that the success message is displayed
            cy.get('[data-test="forgotPwdContainer"]')
                .should('contain.text', 'Check your email for instructions to reset your password.')

            // Verify the email content mock
            const { emailContent } = interception.response.body;
            expect(emailContent).to.include('You are receiving this email because you (or someone else) have requested the reset of the password for your account.');
            expect(emailContent).to.include('Please click on the following link, or paste this into your browser to complete the process:');
            expect(emailContent).to.include('http://localhost:3000/resetPassword/your-token-here');
            expect(emailContent).to.include('If you did not request this, please ignore this email and your password will remain unchanged.');
        });
    })
})