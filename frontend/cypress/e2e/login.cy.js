describe('Login Page Test', () => {
    beforeEach(() => {
      cy.visit('/login')
    })

    // Test that Login title exist 
    it('Contains correct Login text', () => {
        cy.get('[data-test="loginTitle"]').should('contain.text', 'Log in')
    }) 

    // Test that email input field exists and can be typed into
    it('Contains email input field and can type email', () => {
        cy.get('input[placeholder="Enter your registered email."]').should('exist')
        cy.get('input[placeholder="Enter your registered email."]').type('test@example.com')
        cy.get('input[placeholder="Enter your registered email."]').should('have.value', 'test@example.com')
    })

    // Test that password input field exists and can be typed into
    it('Contains password input field and can type password', () => {
        cy.get('input[placeholder="Enter your registered password."]').should('exist')
        cy.get('input[placeholder="Enter your registered password."]').type('password123')
        cy.get('input[placeholder="Enter your registered password."]').should('have.value', 'password123')
    })

    // Test password visibility toggle after typing a password
    it('Can toggle password visibility after typing a password', () => {
        cy.get('input[placeholder="Enter your registered password."]').should('exist')
        cy.get('input[placeholder="Enter your registered password."]').type('password123')
        cy.get('input[placeholder="Enter your registered password."]').should('have.value', 'password123')

        // Check initial state (password hidden)
        cy.get('input[placeholder="Enter your registered password."]').should('have.attr', 'type', 'password')
        
        // Click the eye icon to show the password
        cy.get('.passwordToggleIcon').click()
        cy.get('input[placeholder="Enter your registered password."]').should('have.attr', 'type', 'text')

        // Click the eye icon to hide the password again
        cy.get('.passwordToggleIcon').click()
        cy.get('input[placeholder="Enter your registered password."]').should('have.attr', 'type', 'password')
    })

    // Test that login button exist 
    it('Contains login button', () => {
        cy.get('[data-test="loginBtn"]').should('contain.text', 'Login')
        cy.get('[data-test="loginBtn"]').click()
        cy.get('[data-test="loginContainer"]').should('contain.text', 'Invalid email.')
    })  

    // Test that Forgot Password button exist 
    it('Contains forgot password button', () => {
        cy.get('[data-test="fgtPwdBtn"]').should('contain.text', 'Forgot Password?')
        cy.get('[data-test="fgtPwdBtn"]').click()
        cy.url().should('include', '/forgotPassword')
        cy.visit('/login') 
    })  

    // Test successful login and redirection to /inputOTP
    it('Logs in successfully and redirects to /inputOTP', () => {
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
        cy.visit('/login')
    })

    // Test unsuccessful login due to missing email
    it('Logs in unsuccessfully due to missing email', () => {
        cy.get('input[placeholder="Enter your registered password."]').should('exist')
        cy.get('input[placeholder="Enter your registered password."]').type('Edgar123!')
        
        cy.get('[data-test="loginBtn"]').should('contain.text', 'Login')
        cy.get('[data-test="loginBtn"]').click()

        // Check for success message
        cy.get('.error').should('contain.text', 'Invalid email.')
    })

    // Test unsuccessful login due to missing password
    it('Logs in unsuccessfully due to missing password', () => {
        cy.get('input[placeholder="Enter your registered email."]').should('exist')
        cy.get('input[placeholder="Enter your registered email."]').type('edgaraw29@gmail.com')
        
        cy.get('[data-test="loginBtn"]').should('contain.text', 'Login')
        cy.get('[data-test="loginBtn"]').click()

        // Check for success message
        cy.get('.error').should('contain.text', 'Invalid password.')
    })

    // Test unsuccessful login due to missing email and password
    it('Logs in unsuccessfully due to missing password', () => {        
        cy.get('[data-test="loginBtn"]').should('contain.text', 'Login')
        cy.get('[data-test="loginBtn"]').click()

        // Check for success message
        cy.get('.error').should('contain.text', 'Invalid email.')
    })
})