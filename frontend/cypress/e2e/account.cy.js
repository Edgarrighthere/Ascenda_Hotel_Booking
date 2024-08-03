describe('Account Page', () => {
    beforeEach(() => {
        // Visit the Account page with initial state
        cy.visit('/account', {
            state: {
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                isGuest: false
            }
        });

        // Mock successful API response for sending OTP during account deletion
        cy.intercept('POST', 'http://localhost:5000/send_delete_otp', {
            statusCode: 200
        }).as('sendDeleteOtp');
    });

    it('should display an error message when API call fails', () => {
        // Mock user details API response failure
        cy.intercept('GET', '**/account/details', {
            statusCode: 404,
            body: {
                message: 'User not found'
            }
        }).as('getUserDetails');

        // Verify UI elements
        cy.get('[data-testid="loading"]').should('not.exist');
        cy.get('[data-testid="error"]').should('contain', 'Failed to fetch user details');
    });
  
    it('Should initiate account deletion and navigate to OTP page on confirmation', () => {
      // Visit the account page with user state
      cy.visit('/account', {
        state: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'testuser@example.com',
          isGuest: false
        }
      });
  
      // Open the deletion modal and confirm deletion
      cy.get('[data-testid="deleteAccountButton"]').click();
      cy.get('[data-testid="confirmDelete"]').click();
  
      // Assert redirection to the OTP page
      cy.wait('@sendDeleteOtp');
      cy.url().should('include', '/inputOTP');
      cy.get('[data-testid="inputOTPPage"]').should('exist'); // Adjust this based on your actual OTP page element
    });
  });
  