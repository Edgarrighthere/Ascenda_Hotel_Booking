import { render, screen, cleanup, act, fireEvent, within, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Register from '../src/pages/authentication/Register';
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

describe('Frontend Register Unit Test', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    beforeEach(() => {
      act(() => {
          render(
              <BrowserRouter>
                  <Register />
              </BrowserRouter>
          );
      });
    });
  
    // test('FRONTEND_REGISTER_1: Check if the register header is present', () => {
    //   const registerHeader = screen.getByText('Register', { selector: '.registerTitle' });
    //   expect(registerHeader).toBeInTheDocument();
    //   expect(registerHeader).toHaveClass('registerTitle');
    // });

    // test('FRONTEND_REGISTER_2: Check if the "salutation" section is present', () => {
    //     const dropdown = screen.getByTestId('salutation-dropdown');
        
    //     // Check if the dropdown is present
    //     expect(dropdown).toBeInTheDocument();
        
    //     // Simulate a click to open the dropdown
    //     fireEvent.mouseDown(dropdown);
        
    //     // Check if the dropdown options are visible
    //     const options = within(dropdown).getAllByRole('option');
    //     expect(options).toHaveLength(5); // 4 options + 1 placeholder
        
    //     // Simulate another click to close the dropdown
    //     fireEvent.mouseDown(dropdown);
        
    //     // Check if the dropdown options are still visible
    //     expect(screen.getByText('Select Salutation')).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_3: Check if the "First Name" section is present', () => {
    //   const firstNameSection = screen.getByPlaceholderText(/Enter your first name./i, { selector: 'input' });
    //   expect(firstNameSection).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_4: Check if the "Last Name" section is present', () => {
    //     const lastNameSection = screen.getByPlaceholderText(/Enter your last name./i, { selector: 'input' });
    //     expect(lastNameSection).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_5: Check if the "email" section is present', () => {
    //     const emailSection = screen.getByPlaceholderText(/Enter a registered email, eg. someone123@gmail.com/i, { selector: 'input' });
    //     expect(emailSection).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_6: Check if the "country code" section is present', () => {
    //     const dropdown = screen.getByTestId('countryCode-dropdown');
    
    //     // Check if the dropdown is present
    //     expect(dropdown).toBeInTheDocument();
        
    //     // Simulate a click to open the dropdown
    //     fireEvent.mouseDown(dropdown);
        
    //     // Check if the dropdown options are visible and should be more than one
    //     const options = within(dropdown).getAllByRole('option');
    //     expect(options.length).toBeGreaterThan(1); 
        
    //     // close the drop down
    //     fireEvent.mouseDown(dropdown);
        
    //     expect(screen.getByTestId('countryCode-dropdown')).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_7: Check if the "phone number" section is present', () => {
    //     const phoneNumSection = screen.getByPlaceholderText(/Enter your phone number./i, { selector: 'input' });
    //     expect(phoneNumSection).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_8: Check if the "password" section is present', () => {
    //     const passwordSections = screen.getAllByPlaceholderText(/Enter your password./i);
    //     expect(passwordSections[0]).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_9: Check if the "confirm password" section is present', () => {
    //     const confirmPwdSection = screen.getByPlaceholderText(/Re-enter your password./i, { selector: 'input' });
    //     expect(confirmPwdSection).toBeInTheDocument();
    // });

    // test('FRONTEND_REGISTER_10: Check if the "register" button is present and clickable', async () => {
    //     const registerButton = screen.getByTestId('registerBtn');

    //     // Simulate a click on the register button
    //     fireEvent.click(registerButton);
    
    //     // Check if the error message is displayed
    //     const errorMessage = screen.getByTestId('error-message');
    //     expect(errorMessage).toBeInTheDocument();
    //     expect(errorMessage).toHaveTextContent('Check that all fields are filled.');
    // });

    // test('FRONTEND_REGISTER_11: Displays error when password is less than 8 characters', async () => {
    //     fireEvent.change(screen.getByPlaceholderText('Enter your first name.'), { target: { value: 'Tin' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter your last name.'), { target: { value: 'Tin' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter a registered email, eg. someone123@gmail.com'), { target: { value: 'test@example.com' } });
    //     fireEvent.change(screen.getByTestId('salutation-dropdown'), { target: { value: 'Mr' } });
    //     fireEvent.change(screen.getByTestId('countryCode-dropdown'), { target: { value: '+65' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter your phone number.'), { target: { value: '12345678' } });
        
    //     // Set a password less than 8 characters
    //     fireEvent.change(screen.getByPlaceholderText('Enter your password.'), { target: { value: 'pass' } });
    //     fireEvent.change(screen.getByPlaceholderText('Re-enter your password.'), { target: { value: 'pass' } });

    //     const registerButton = screen.getByTestId('registerBtn');
    //     fireEvent.click(registerButton);

    //     // Check if the error message is displayed
    //     const errorMessage = screen.getByTestId('error-message');
    //     expect(errorMessage).toBeInTheDocument();
    //     expect(errorMessage).toHaveTextContent('Password must be at least 8 characters long, contain at least one uppercase letter, and one special character (!@#$%^&*).');
    // });

    // test('FRONTEND_REGISTER_12: Displays error when passwords do not match', async () => {
    //     fireEvent.change(screen.getByPlaceholderText('Enter your first name.'), { target: { value: 'Tim' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter your last name.'), { target: { value: 'Tam' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter a registered email, eg. someone123@gmail.com'), { target: { value: 'test@test.com' } });
    //     fireEvent.change(screen.getByTestId('salutation-dropdown'), { target: { value: 'Mr' } });
    //     fireEvent.change(screen.getByTestId('countryCode-dropdown'), { target: { value: '+65' } });
    //     fireEvent.change(screen.getByPlaceholderText('Enter your phone number.'), { target: { value: '12345678' } });
        
    //     // Set a password less than 8 characters
    //     fireEvent.change(screen.getByPlaceholderText('Enter your password.'), { target: { value: 'password123' } });
    //     fireEvent.change(screen.getByPlaceholderText('Re-enter your password.'), { target: { value: 'differentPassword' } });

    //     const registerButton = screen.getByTestId('registerBtn');
    //     fireEvent.click(registerButton);

    //     // Check if the error message is displayed
    //     const errorMessage = screen.getByTestId('error-message');
    //     expect(errorMessage).toBeInTheDocument();
    //     expect(errorMessage).toHaveTextContent('Passwords do not match.');
    // });

    test('FRONTEND_REGISTER_13: Display success message upon successful registration', async () => {
        fireEvent.change(screen.getByPlaceholderText('Enter your first name.'), { target: { value: 'Tam' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your last name.'), { target: { value: 'Tam' } });
        fireEvent.change(screen.getByPlaceholderText('Enter a registered email, eg. someone123@gmail.com'), { target: { value: 'test@test.com' } });
        fireEvent.change(screen.getByTestId('salutation-dropdown'), { target: { value: 'Mr' } });
        fireEvent.change(screen.getByTestId('countryCode-dropdown'), { target: { value: '+65' } });
        fireEvent.change(screen.getByPlaceholderText('Enter your phone number.'), { target: { value: '12345678' } });
        
        // Set a password less than 8 characters
        fireEvent.change(screen.getByPlaceholderText('Enter your password.'), { target: { value: 'Password@123' } });
        fireEvent.change(screen.getByPlaceholderText('Re-enter your password.'), { target: { value: 'Password@123' } });

        const registerButton = screen.getByTestId('registerBtn');
        fireEvent.click(registerButton);

        // Check if the error message is displayed
        const successMessage = await waitFor(() => screen.getByTestId('success-message'));
        expect(successMessage).toBeInTheDocument();
        expect(successMessage).toHaveTextContent('User successfully created. Please log in.');
    });
});
