import { render, screen, cleanup, act } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from './Login';
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

describe('Frontend Login Unit Test', async () => {
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
  
    test('FRONTEND_LOGIN_1: Check if the login header is present', () => {
      const loginHeader = screen.getByText('Log in', { selector: '.loginTitle' });
      expect(loginHeader).toBeInTheDocument();
      expect(loginHeader).toHaveClass('loginTitle');

      //console.log('FRONTEND_LOGIN_1 passed: Login header is present.');
    });

    test('FRONTEND_LOGIN_2: Check if the "email" section is present', () => {
      const emailSection = screen.getByPlaceholderText(/Enter your registered email./i, { selector: 'input' });
      expect(emailSection).toBeInTheDocument();

      //console.log('FRONTEND_LOGIN_2 passed: Email section is present.');
    });

    test('FRONTEND_LOGIN_3: Check if the "password" section is present', () => {
      const passwordSection = screen.getByPlaceholderText(/Enter your registered password./i, { selector: 'input' });
      expect(passwordSection).toBeInTheDocument();

      //console.log('FRONTEND_LOGIN_3 passed: Password section is present.');
    });

    test('FRONTEND_LOGIN_4: Check if the "Login" button is present and clickable', async () => {
      const loginButton = screen.getByRole('button', { name: /Login/i });
      expect(loginButton).toBeInTheDocument();
      userEvent.click(loginButton);

      //console.log('FRONTEND_LOGIN_4 passed: Login button is present and clickable.');
    });

    test('FRONTEND_LOGIN_5: Check if the "Forgot Password?" button is present, clickable, and redirect to forgot password page', () => {
      const forgotPasswordButton = screen.getByRole('button', { name: /Forgot Password?/i });
      expect(forgotPasswordButton).toBeInTheDocument();
      userEvent.click(forgotPasswordButton);
      expect(mockNavigate).toHaveBeenCalledWith('/forgotPassword');

      //console.log('FRONTEND_LOGIN_5 passed: Forgot Password button is present, clickable, and redirects to forgot password page.');
    });

    test('FRONTEND_LOGIN_6: Check for successful login', async () => {
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

    test('FRONTEND_LOGIN_7: Check for unsuccessful login due to missing email', async () => {
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

    test('FRONTEND_LOGIN_8: Check for unsuccessful login due to missing email AND password', async () => {
      const emailInput3 = screen.getByPlaceholderText(/Enter your registered email./i);
      const passwordInput3 = screen.getByPlaceholderText(/Enter your registered password./i);
      const submitButton = screen.getByRole('button', { name: /Login/i });

      // Check if the inputs have the correct values
      expect(emailInput3).toHaveValue('');
      expect(passwordInput3).toHaveValue('');
  
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

    test('FRONTEND_LOGIN_9: Check for unsuccessful login due to missing password', async () => {
      const emailInput4 = screen.getByPlaceholderText(/Enter your registered email./i);
      const passwordInput4 = screen.getByPlaceholderText(/Enter your registered password./i);
      const submitButton = screen.getByRole('button', { name: /Login/i });
  
      // Simulate user typing into the inputs
      await act(async () => {
        userEvent.type(emailInput4, 'edgaraw29@gmail.com');
      });

      // Check if the inputs have the correct values
      expect(emailInput4).toHaveValue('edgaraw29@gmail.com');
      expect(passwordInput4).toHaveValue('');
  
      // Simulate a successful login response from the server
      await act(async () => {
          userEvent.click(submitButton);
  
          // Mock the response after the button is clicked
          mockAxios.mockResponse({
              data: {
                success: false,
                message: 'Invalid password.'
              }
          });
      });
  
      // Verify that the error message is displayed
      const errorMessage = screen.getByText(/Invalid password./i);
      expect(errorMessage).toBeInTheDocument();
    });
});
