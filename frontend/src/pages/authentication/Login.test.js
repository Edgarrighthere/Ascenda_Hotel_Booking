import { render, screen, cleanup } from '@testing-library/react';
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

describe('Testing Login Page', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    beforeEach(() => {
      render(
          <BrowserRouter>
              <Login />
          </BrowserRouter>
      );
    });
  
    test('FRONTEND_LOGIN_1: Check if the login header is present', () => {
      const loginHeader = screen.getByText('Log in', { selector: '.loginTitle' });
      expect(loginHeader).toBeInTheDocument();
      expect(loginHeader).toHaveClass('loginTitle');
    });

    test('FRONTEND_LOGIN_2: Check if the "email" section is present', () => {
      const emailSection = screen.getByPlaceholderText(/Enter your registered email./i, { selector: 'input' });
      expect(emailSection).toBeInTheDocument();
    });

    test('FRONTEND_LOGIN_3: Check if the "password" section is present', () => {
      const passwordSection = screen.getByPlaceholderText(/Enter your registered password./i, { selector: 'input' });
      expect(passwordSection).toBeInTheDocument();
    });

    test('FRONTEND_LOGIN_4: Check if the "Login" button is present and clickable', () => {
      const loginButton = screen.getByRole('button', { name: /Login/i });
      expect(loginButton).toBeInTheDocument();
      userEvent.click(loginButton);
    });

    test('FRONTEND_LOGIN_5: Check if the "Forgot Password?" button is present, clickable, and redirect to forgot password page', () => {
      const forgotPasswordButton = screen.getByRole('button', { name: /Forgot Password?/i });
      expect(forgotPasswordButton).toBeInTheDocument();
      userEvent.click(forgotPasswordButton);
      expect(mockNavigate).toHaveBeenCalledWith('/forgotPassword');
    });

    test('FRONTEND_LOGIN_6: Check for successful login', async () => {
      const emailInput = screen.getByPlaceholderText(/Enter your registered email./i);
      const passwordInput = screen.getByPlaceholderText(/Enter your registered password./i);
      const submitButton = screen.getByRole('button', { name: /Login/i });
    
      // Simulate user typing into the inputs
      userEvent.type(emailInput, 'edgaraw29@gmail.com');
      userEvent.type(passwordInput, 'Edgar123!');
    
      // Check if the inputs have the correct values
      expect(emailInput).toHaveValue('edgaraw29@gmail.com');
      expect(passwordInput).toHaveValue('Edgar123!');

      // Check if can click on log in button
      userEvent.click(submitButton);

      // Simulate a successful login response from the server
      await mockAxios.mockResponse({ data: { success: true } });
      //expect(mockNavigate).toHaveBeenCalledWith('/inputOTP');
    });
});
  