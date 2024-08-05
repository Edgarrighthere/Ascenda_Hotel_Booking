describe('Register Page Test', () => {
    beforeEach(() => {
      cy.visit('/register')
    })

    // Test that Register title exist 
    it('Contains correct Register text', () => {
        cy.get('[data-test="registerTitle"]').should('contain.text', 'Register')
    }) 

    // Test that salutation select dropdown works correctly
    it('Can select a salutation from the dropdown', () => {
        cy.get('select.registerInputSalutation').should('exist')
        cy.get('select.registerInputSalutation').select('Mr')
        cy.get('select.registerInputSalutation').should('have.value', 'Mr')

        cy.get('select.registerInputSalutation').select('Ms')
        cy.get('select.registerInputSalutation').should('have.value', 'Ms')

        cy.get('select.registerInputSalutation').select('Mdm')
        cy.get('select.registerInputSalutation').should('have.value', 'Mdm')

        cy.get('select.registerInputSalutation').select('Dr')
        cy.get('select.registerInputSalutation').should('have.value', 'Dr')
    })

    // Test that first name input field exists and can be typed into
    it('Contains first name input field and can type first name', () => {
        cy.get('input[placeholder="Enter your first name."]').should('exist')
        cy.get('input[placeholder="Enter your first name."]').type('Tin')
        cy.get('input[placeholder="Enter your first name."]').should('have.value', 'Tin')
    })

    // Test that last name input field exists and can be typed into
    it('Contains last name input field and can type last name', () => {
        cy.get('input[placeholder="Enter your last name."]').should('exist')
        cy.get('input[placeholder="Enter your last name."]').type('Tin')
        cy.get('input[placeholder="Enter your last name."]').should('have.value', 'Tin')
    })

    // Test that email input field exists and can be typed into
    it('Contains email input field and can type email', () => {
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').should('exist')
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').type('test@example.com')
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').should('have.value', 'test@example.com')
    })

    // Test that country code dropdown works correctly
    it('Can select a country code from the dropdown', () => {
        cy.get('select.registerInputCountryCode').should('exist')
    
        // Open the dropdown to check for options
        cy.get('select.registerInputCountryCode').then(select => {
            select[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
        })
        cy.get('select.registerInputCountryCode option').should('have.length.greaterThan', 1)
    
        // Close the dropdown by clicking outside
        cy.get('body').click()
    
        // Open the dropdown again to select an option
        cy.get('select.registerInputCountryCode').then(select => {
            select[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
        })
        cy.get('select.registerInputCountryCode').select('Singapore (+65)')
        cy.get('select.registerInputCountryCode').should('have.value', '+65')
    })
    
    // Test that phone number input field exists and can be typed into
    it('Contains phone numnber input field and can type phone number', () => {
        cy.get('input[placeholder="Enter your phone number."]').should('exist')
        cy.get('input[placeholder="Enter your phone number."]').type('12345678')
        cy.get('input[placeholder="Enter your phone number."]').should('have.value', '12345678')
    })

    // Test that password input field exists and can be typed into
    it('Contains password input field and can type password', () => {
        cy.get('input[placeholder="Enter your password."]').should('exist')
        cy.get('input[placeholder="Enter your password."]').type('password123')
        cy.get('input[placeholder="Enter your password."]').should('have.value', 'password123')
    })

    // Test that password confirmation input field exists and can be typed into
    it('Contains password input field and can type password', () => {
        cy.get('input[placeholder="Re-enter your password."]').should('exist')
        cy.get('input[placeholder="Re-enter your password."]').type('password123')
        cy.get('input[placeholder="Re-enter your password."]').should('have.value', 'password123')
    })

    // Test password visibility toggle after typing a password
    it('Can toggle password visibility after typing a password', () => {
        cy.get('input[placeholder="Enter your password."]').should('exist')
        cy.get('input[placeholder="Enter your password."]').type('password123')
        cy.get('input[placeholder="Enter your password."]').should('have.value', 'password123')

        // Check initial state (password hidden)
        cy.get('input[placeholder="Enter your password."]').should('have.attr', 'type', 'password')
        
        // Click the eye icon to show the password
        cy.get('[data-test="pwdToggle"]').click()
        cy.get('input[placeholder="Enter your password."]').should('have.attr', 'type', 'text')

        // Click the eye icon to hide the password again
        cy.get('[data-test="pwdToggle"]').click()
        cy.get('input[placeholder="Enter your password."]').should('have.attr', 'type', 'password')
    })

    // Test password visibility toggle after typing confirmation password
    it('Can toggle password visibility after typing confirmation password', () => {
        cy.get('input[placeholder="Re-enter your password."]').should('exist')
        cy.get('input[placeholder="Re-enter your password."]').type('password123')
        cy.get('input[placeholder="Re-enter your password."]').should('have.value', 'password123')

        // Check initial state (password hidden)
        cy.get('input[placeholder="Re-enter your password."]').should('have.attr', 'type', 'password')
        
        // Click the eye icon to show the password
        cy.get('[data-test="confirmPwdToggle"]').click()
        cy.get('input[placeholder="Re-enter your password."]').should('have.attr', 'type', 'text')

        // Click the eye icon to hide the password again
        cy.get('[data-test="confirmPwdToggle"]').click()
        cy.get('input[placeholder="Re-enter your password."]').should('have.attr', 'type', 'password')
    })

    // Test that register button exist 
    it('Contains register button', () => {
        cy.get('[data-test="registerBtn"]').should('contain.text', 'Register Now!')
        cy.get('[data-test="registerBtn"]').click()
        cy.get('[data-test="registerContainer"]').should('contain.text', 'Check that all fields are filled.')
    })    

    // Test that all inputs are filled but password is less than 8 characters
    it('Displays error when password is less than 8 characters', () => {
        cy.get('select.registerInputSalutation').select('Mr')
        cy.get('input[placeholder="Enter your first name."]').type('Tin')
        cy.get('input[placeholder="Enter your last name."]').type('Tin')
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').type('test@example.com')
        cy.get('select.registerInputCountryCode').select('Singapore (+65)')
        cy.get('input[placeholder="Enter your phone number."]').type('12345678')
        cy.get('input[placeholder="Enter your password."]').type('pass')
        cy.get('input[placeholder="Re-enter your password."]').type('pass')
        cy.get('[data-test="registerBtn"]').click()
        cy.get('[data-test="registerContainer"]').should('contain.text', 'Password must be at least 8 characters long, contain at least one uppercase letter, and one special character (!@#$%^&*).')
    })

    // Test that all inputs are filled but passwords do not match
    it('Displays error when passwords do not match', () => {
        cy.get('select.registerInputSalutation').select('Mr')
        cy.get('input[placeholder="Enter your first name."]').type('Tin')
        cy.get('input[placeholder="Enter your last name."]').type('Tin')
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').type('test@example.com')
        cy.get('select.registerInputCountryCode').select('Singapore (+65)')
        cy.get('input[placeholder="Enter your phone number."]').type('12345678')
        cy.get('input[placeholder="Enter your password."]').type('password123')
        cy.get('input[placeholder="Re-enter your password."]').type('differentPassword')
        cy.get('[data-test="registerBtn"]').click()
        cy.get('[data-test="registerContainer"]').should('contain.text', 'Passwords do not match.')
    })

    // Test that all inputs are filled correctly
    it('Display success message upon successful registration', () => {
        // Fill out the registration form
        cy.get('select.registerInputSalutation').select('Mr')
        cy.get('input[placeholder="Enter your first name."]').type('Test')
        cy.get('input[placeholder="Enter your last name."]').type('User')
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').type('test@example.com')
        cy.get('select.registerInputCountryCode').select('Singapore (+65)')
        cy.get('input[placeholder="Enter your phone number."]').type('12345678')
        cy.get('input[placeholder="Enter your password."]').type('Password@123')
        cy.get('input[placeholder="Re-enter your password."]').type('Password@123')

        // Intercept the network request
        cy.intercept('POST', '/register', {
            statusCode: 201,
            body: {
                message: 'User successfully created. Redirecting to Login page now...'
            }
        }).as('registerRequest')

        // Click the register button
        cy.get('[data-test="registerBtn"]').click()

        // Wait for the mocked request to complete
        cy.wait('@registerRequest')

        // Verify that the success message is displayed
        cy.get('[data-test="registerContainer"]')
            .should('contain.text', 'User successfully created. Redirecting to Login page now...')
    })

    it('should display error message if user re-registers with the same email', () => {
        // Fill out the registration form with unique details
        cy.get('select.registerInputSalutation').select('Mr')
        cy.get('input[placeholder="Enter your first name."]').type('Tin')
        cy.get('input[placeholder="Enter your last name."]').type('Tin')
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').type('test@test.com')
        cy.get('select.registerInputCountryCode').select('Singapore (+65)')
        cy.get('input[placeholder="Enter your phone number."]').type('12345678')
        cy.get('input[placeholder="Enter your password."]').type('Password@123')
        cy.get('input[placeholder="Re-enter your password."]').type('Password@123')

        // Intercept the network request for successful registration
        cy.intercept('POST', '/register', {
            statusCode: 201,
            body: {
                message: 'User successfully created. Redirecting to Login page now...'
            }
        }).as('registerRequest')

        // Click the register button
        cy.get('[data-test="registerBtn"]').click()

        // Wait for the successful registration request to complete
        cy.wait('@registerRequest')

        // Verify the success message
        cy.get('[data-test="registerContainer"]')
            .should('contain.text', 'User successfully created. Redirecting to Login page now...')

        // Intercept the network request for a registration attempt with an existing email
        cy.intercept('POST', '/register', {
            statusCode: 400,
            body: {
                message: 'User already exists. Please log in.'
            }
        }).as('registerRequestDuplicate')

        // Attempt to re-register with the same email
        cy.visit('/register') // Revisit the registration page

        // Fill out the form with the same email
        cy.get('select.registerInputSalutation').select('Mr')
        cy.get('input[placeholder="Enter your first name."]').type('Tim')
        cy.get('input[placeholder="Enter your last name."]').type('Tam')
        cy.get('input[placeholder="Enter a registered email, eg. someone123@gmail.com"]').type('test@test.com')
        cy.get('select.registerInputCountryCode').select('Singapore (+65)')
        cy.get('input[placeholder="Enter your phone number."]').type('12345678')
        cy.get('input[placeholder="Enter your password."]').type('Password@456')
        cy.get('input[placeholder="Re-enter your password."]').type('Password@456')

        // Click the register button
        cy.get('[data-test="registerBtn"]').click()

        // Wait for the registration attempt with duplicate email
        cy.wait('@registerRequestDuplicate')

        // Verify the error message is displayed
        cy.get('[data-test="registerContainer"]')
            .should('contain.text', 'User already exists. Please log in.')
    })
})