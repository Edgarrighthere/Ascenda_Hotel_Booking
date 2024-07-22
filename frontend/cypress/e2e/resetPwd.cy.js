describe('Reset Password Page Test', () => {
    const mockToken = 'mock-token-123456';
    const oldPassword = 'OldPassword@123';
    const newPassword = 'NewPassword@123';

    beforeEach(() => {
        cy.visit(`/resetPassword/${mockToken}`)
    })

    // Test that Reset Password title exist 
    it('Contains correct Reset Password text', () => {
        cy.get('[data-test="resetPwdTitle"]').should('contain.text', 'Reset Password')
    }) 

    // Test that new password input field exists and can be typed into
    it('Contains new password input field and can type new password', () => {
        cy.get('input[placeholder="Enter your new password."]').should('exist')
        cy.get('input[placeholder="Enter your new password."]').type('Password@123')
        cy.get('input[placeholder="Enter your new password."]').should('have.value', 'Password@123')
    })

    // Test that confirm new password input field exists and can be typed into
    it('Contains confirm new password input field and can confirm new password', () => {
        cy.get('input[placeholder="Confirm your new password."]').should('exist')
        cy.get('input[placeholder="Confirm your new password."]').type('Password@123')
        cy.get('input[placeholder="Confirm your new password."]').should('have.value', 'Password@123')
    })

    // Test that reset password button exist 
    it('Contains reset password button', () => {
        cy.get('[data-test="resetPwdButton"]').should('contain.text', 'Reset Password')
        cy.get('[data-test="resetPwdButton"]').click()
        cy.get('[data-test="resetPwdContainer"]').should('contain.text', 'Invalid or expired token.')
    })    

    it('Shows error message when passwords do not match', () => {
        cy.get('input[placeholder="Enter your new password."]').type('Password@123')
        cy.get('input[placeholder="Confirm your new password."]').type('DifferentPassword@123')
        cy.get('[data-test="resetPwdButton"]').click()
        cy.get('.error').should('contain.text', 'Passwords do not match.')
    })

    // Test that an error message is shown when new password is same as old password
    it('Shows error message when new password is same as old password', () => {
        cy.intercept('POST', `/reset-password/${mockToken}`, {
            statusCode: 400,
            body: {
                message: 'New password cannot be the same as the old password.'
            }
        }).as('resetPasswordRequest')

        cy.get('input[placeholder="Enter your new password."]').type(oldPassword)
        cy.get('input[placeholder="Confirm your new password."]').type(oldPassword)
        cy.get('[data-test="resetPwdButton"]').click()
        cy.wait('@resetPasswordRequest')
        cy.get('.error').should('contain.text', 'New password cannot be the same as the old password.')
    })

    // Test that a success message is shown and user is redirected to login page
    it('Shows success message and redirects to login page', () => {
        cy.intercept('POST', `/reset-password/${mockToken}`, {
            statusCode: 200,
            body: {
                message: 'Password reset successful. Redirecting to login page...'
            }
        }).as('resetPasswordRequestSuccess')

        cy.get('input[placeholder="Enter your new password."]').type(newPassword)
        cy.get('input[placeholder="Confirm your new password."]').type(newPassword)
        cy.get('[data-test="resetPwdButton"]').click()
        cy.wait('@resetPasswordRequestSuccess')
        cy.get('.success').should('contain.text', 'Password reset successful. Redirecting to login page...')
        cy.url().should('include', '/login', { timeout: 5000 }) // Verify the URL after redirection
    })
})