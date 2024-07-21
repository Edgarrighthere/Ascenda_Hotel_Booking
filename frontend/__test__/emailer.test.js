import { render, screen, cleanup, act } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../src/pages/authentication/Login';
import mockAxios from 'jest-mock-axios';
import React from "react";

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

afterEach(() => {
    mockAxios.reset();
    cleanup();
});

describe('Frontend Login Integration with emailer Test', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    beforeEach(() => {
      act(() => {
          render(
              <BrowserRouter>
                  <Login />
              </BrowserRouter>
          );
      });
    });

    test('FRONTEND_EMAILER_1: Check if the user can see success message to check email', async () => {
        const emailInput = screen.getByPlaceholderText(/Enter your registered email./i);
        const passwordInput = screen.getByPlaceholderText(/Enter your registered password./i);
        const submitButton = screen.getByRole('button', { name: /Login/i });
    
        // Simulate user typing into the inputs
        await act(async () => {
            userEvent.type(emailInput, 'edgaraw29@gmail.com');
            userEvent.type(passwordInput, 'Edgar123!');
        });
    
        // Check if the inputs have the correct values
        expect(emailInput).toHaveValue('edgaraw29@gmail.com');
        expect(passwordInput).toHaveValue('Edgar123!');
    
        // Simulate a successful login response from the server
        await act(async () => {
            userEvent.click(submitButton);
    
            // Mock the response after the button is clicked
            mockAxios.mockResponse({
                data: {
                    success: true,
                    message: 'Login successful. Verify with the OTP sent to your registered email...',
                    salutation: 'Mr',
                    firstName: 'Edgar',
                    lastName: 'Aw'
                }
            });
        });
        // Verify that the success message is displayed
        const successMessage = screen.getByText(/Login successful. Verify with the OTP sent to your registered email.../i);
        expect(successMessage).toBeInTheDocument();
    });
});
