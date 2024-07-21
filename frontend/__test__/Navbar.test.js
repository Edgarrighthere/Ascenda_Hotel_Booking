import { render, screen, cleanup, act } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Login from '../src/pages/authentication/Login';
import Navbar from '../src/components/navbar/Navbar';
import mockAxios from 'jest-mock-axios';
import React from "react";

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.setTimeout(10000);

afterEach(() => {
    mockAxios.reset();
    cleanup();
});

describe('Frontend Login Integration with Navbar Test', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    beforeEach(() => {
        act(() => {
            render(
                <BrowserRouter>
                    <Navbar />
                    <Login />
                </BrowserRouter>
            );
        });
    });

    test('FRONTEND_NAVBAR_1: Check if the navbar displays correct welcome info after successful login', async () => {
        // First, simulate a successful login
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

        localStorage.setItem('salutation', 'Mr');
        localStorage.setItem('firstName', 'Edgar');
        localStorage.setItem('lastName', 'Aw');

        // Re-render Navbar to reflect the state update
        act(() => {
            render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );
        });

        // Log the state of localStorage for debugging
        //console.log('localStorage salutation:', localStorage.getItem('salutation'));
        //console.log('localStorage firstName:', localStorage.getItem('firstName'));
        //console.log('localStorage lastName:', localStorage.getItem('lastName'));

        // Check if the navbar shows the correct message after successful login
        const dropdownButton = await screen.findByRole('button', { name: /Welcome, Mr Edgar Aw!/i });
        expect(dropdownButton).toBeInTheDocument();
    });

    test('FRONTEND_NAVBAR_2: Check if the navbar still displays "Welcome, Guest!" after unsuccessful login', async () => {
        // First, simulate an unsuccessful login
        const emailInput2 = screen.getByPlaceholderText(/Enter your registered email./i);
        const passwordInput2 = screen.getByPlaceholderText(/Enter your registered password./i);
        const submitButton = screen.getByRole('button', { name: /Login/i });

        // Check if the inputs have the correct values
        expect(emailInput2).toHaveValue('');
        expect(passwordInput2).toHaveValue('');
    
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

        localStorage.setItem('salutation', 'Guest');
        localStorage.setItem('firstName', '');
        localStorage.setItem('lastName', '');

        // Re-render Navbar to reflect the state update
        act(() => {
            render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );
        });

        // Ensure the UI update has time to propagate
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Log the state of localStorage for debugging
        //console.log('localStorage salutation:', localStorage.getItem('salutation'));
        //console.log('localStorage firstName:', localStorage.getItem('firstName'));
        //console.log('localStorage lastName:', localStorage.getItem('lastName'));

        // Check if the navbar shows the correct message after successful login
        const dropdownButton = await screen.findByRole('button', { name: /Welcome, Guest/i });
        expect(dropdownButton).toBeInTheDocument();
    });
});
