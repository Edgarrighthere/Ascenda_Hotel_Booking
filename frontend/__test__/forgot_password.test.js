import { render, screen, cleanup, act, fireEvent, within, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ForgotPwd from '../src/pages/authentication/ForgotPwd';
import mockAxios from 'jest-mock-axios';
import React from "react";

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Frontend Forgot Password Unit and Integration Test', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    beforeEach(() => {
      act(() => {
          render(
              <BrowserRouter>
                  <ForgotPwd />
              </BrowserRouter>
          );
      });
    });
  
    test('FRONTEND_FORGOTPWD_1: Check if the register header is present', () => {
      const forgotPwdHeader = screen.getByText('Forgot Password', { selector: '.forgotPasswordTitle' });
      expect(forgotPwdHeader).toBeInTheDocument();
      expect(forgotPwdHeader).toHaveClass('forgotPasswordTitle');
    });

    test('FRONTEND_FORGOTPWD_2: Check if the register header is present', () => {
        const emailSection = screen.getByPlaceholderText(/Enter your registered email./i, { selector: 'input' });
        expect(emailSection).toBeInTheDocument();
    });

    test('FRONTEND_FORGOTPWD_3: Check if the "send reset password email" button is present and clickable', async () => {
        const forgotPwdButton = screen.getByTestId('forgotPwdBtn');
        
        await act(async () => {
            fireEvent.click(forgotPwdButton);

            // Mock the axios post call to return a error response
            mockAxios.mockResponse({
                data: {
                    success: false,
                    message: 'Invalid email. Please try again.'
                }
            });
        });
    
        // Check if the error message is displayed
        const errorMessage = screen.getByText(/Invalid email. Please try again./i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('FRONTEND_FORGOTPWD_4: Checks for success message after user input his email and clicks on button', async () => {    
        fireEvent.change(screen.getByPlaceholderText('Enter your registered email.'), { target: { value: 'validemail@test.com' } });
        const forgotPwdButton = screen.getByTestId('forgotPwdBtn');
        
        await act(async () => {
            fireEvent.click(forgotPwdButton);

            // Mock the axios post call to return a success response
            mockAxios.mockResponse({
                data: {
                    success: true,
                    message: 'Check your email for instructions to reset your password.'
                }
            });
        });
        
        // Check if the success message is displayed
        const successMessage = screen.getByText(/Check your email for instructions to reset your password./i);
        expect(successMessage).toBeInTheDocument();
    });
});