import { render, screen, cleanup, act } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../src/pages/authentication/Login';
import Navbar from '../src/components/navbar/Navbar';
import InputOTP from "../src/pages/authentication/InputOTP";
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

describe('Frontend Login Integration Test', async () => {
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
  
    test('FRONTEND_NAVBAR_1: Check if the navbar displays correct info after successful login', () => {
      const loginHeader = screen.getByText('Log in', { selector: '.loginTitle' });
      expect(loginHeader).toBeInTheDocument();
      expect(loginHeader).toHaveClass('loginTitle');

    });

    test('FRONTEND_NAVBAR_2: Check if the navbar still displays "Welcome, Guest!" after unsuccessful login', () => {
      const emailSection = screen.getByPlaceholderText(/Enter your registered email./i, { selector: 'input' });
      expect(emailSection).toBeInTheDocument();

    });

    test('FRONTEND_EMAILER_1: Check if the user receives email upon redirecting to /inputOTP page', () => {
      const passwordSection = screen.getByPlaceholderText(/Enter your registered password./i, { selector: 'input' });
      expect(passwordSection).toBeInTheDocument();

    });

    test('FRONTEND_VERIFY_OTP_1: Check if the /inputOTP header is present', () => {
      const loginButton = screen.getByRole('button', { name: /Login/i });
      expect(loginButton).toBeInTheDocument();

      // Simulate a successful login response from the server
      await act(async () => {
        userEvent.click(loginButton);

        // Mock the response after the button is clicked
        mockAxios.mockResponse({
            data: {
              success: false,
              message: 'Invalid email.'
            }
          });
      });

      // Verify that the error message is displayed
      const errorMessage = screen.getByText(/Invalid email./i);
      expect(errorMessage).toBeInTheDocument();

    });

    test('FRONTEND_VERIFY_OTP_2: Check if the input OTP section is present', () => {
      const forgotPasswordButton = screen.getByRole('button', { name: /Forgot Password?/i });
      expect(forgotPasswordButton).toBeInTheDocument();
      userEvent.click(forgotPasswordButton);
      expect(mockNavigate).toHaveBeenCalledWith('/forgotPassword');

    });

    test('FRONTEND_VERIFY_OTP_3: Check if the "verify OTP" button is present', async () => {
      const emailInput1 = screen.getByPlaceholderText(/Enter your registered email./i);
      const passwordInput1 = screen.getByPlaceholderText(/Enter your registered password./i);
      const submitButton = screen.getByRole('button', { name: /Login/i });
  
      // Simulate user typing into the inputs
      await act(async () => {
          userEvent.type(emailInput1, 'edgaraw29@gmail.com');
          userEvent.type(passwordInput1, 'Edgar123!');
      });
  
      // Check if the inputs have the correct values
      expect(emailInput1).toHaveValue('edgaraw29@gmail.com');
      expect(passwordInput1).toHaveValue('Edgar123!');
  
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
  
      // Use a short delay to allow the navigation to occur
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      // Expect navigate to be called with the correct state
      expect(mockNavigate).toHaveBeenCalledWith('/inputOTP', {
          state: {
            email: 'edgaraw29@gmail.com',
            salutation: 'Mr',
            firstName: 'Edgar',
            lastName: 'Aw'
          }
      });
    });

    test('FRONTEND_VERIFY_OTP_4: Check if the "resend code" text is present', async () => {
      const emailInput2 = screen.getByPlaceholderText(/Enter your registered email./i);
      const passwordInput2 = screen.getByPlaceholderText(/Enter your registered password./i);
      const submitButton = screen.getByRole('button', { name: /Login/i });
  
      // Simulate user typing into the inputs
      await act(async () => {
          userEvent.type(passwordInput2, 'Edgar123!');
      });
  
      // Check if the inputs have the correct values
      expect(emailInput2).toHaveValue('');
      expect(passwordInput2).toHaveValue('Edgar123!');
  
      // Simulate a successful login response from the server
      await act(async () => {
          userEvent.click(submitButton);
  
          // Mock the response after the button is clicked
          mockAxios.mockResponse({
              data: {
                success: false,
                message: 'Invalid email.'
              }
          });
      });
  
      // Verify that the error message is displayed
      const errorMessage = screen.getByText(/Invalid email./i);
      expect(errorMessage).toBeInTheDocument();
    });
});
