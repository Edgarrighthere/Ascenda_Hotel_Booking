import { render, screen, cleanup, act, fireEvent, within, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ResetPwd from '../src/pages/authentication/ResetPwd';
import mockAxios from 'jest-mock-axios';
import axios from 'axios';
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

describe('Frontend Reset Password Unit Test', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    beforeEach(() => {
        act(() => {
            render(
                <BrowserRouter>
                    <ResetPwd />
                </BrowserRouter>
            );
        });
    });
  
    test('FRONTEND_RESETPWD_1: Check if the reset password header is present', () => {
      const resetPwdHeader = screen.getByText('Reset Password', { selector: '.resetPasswordTitle' });
      expect(resetPwdHeader).toBeInTheDocument();
      expect(resetPwdHeader).toHaveClass('resetPasswordTitle');
    });

    test('FRONTEND_RESETPWD_2: Check if the "password" section is present', () => {
        const passwordSections = screen.getAllByPlaceholderText(/Enter your new password./i);
        expect(passwordSections[0]).toBeInTheDocument();
    });

    test('FRONTEND_RESETPWD_3: Check if the "confirm password" section is present', () => {
        const confirmPwdSection = screen.getByPlaceholderText(/Confirm your new password./i, { selector: 'input' });
        expect(confirmPwdSection).toBeInTheDocument();
    });

    test('FRONTEND_RESETPWD_4: Check if the "reset password" button is present and clickable', async () => {
        const resetPwdButton = screen.getByTestId('resetPwdButton');
        
        await act(async () => {
            fireEvent.click(resetPwdButton);

            // Mock the axios post call to return a error response
            mockAxios.mockResponse({
                data: {
                    success: false,
                    message: 'Invalid or expired token.'
                }
            });
        });
    
        // Check if the error message is displayed
        const errorMessage = screen.getByText(/Invalid or expired token./i);
        expect(errorMessage).toBeInTheDocument();
    });
});

describe('Frontend Reset Password Unit and Integration Test', () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    beforeEach(() => {
        act(() => {
            render(
                <BrowserRouter>
                    <ResetPwd />
                </BrowserRouter>
            );
        });
    });

    test('FRONTEND_RESETPWD_5: Shows error message when passwords do not match', async () => {
        fireEvent.change(screen.getByPlaceholderText('Enter your new password.'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your new password.'), { target: { value: 'differentPassword' } });
        const resetPwdButton = screen.getByTestId('resetPwdButton');
        fireEvent.click(resetPwdButton);
    
        // Check if the error message is displayed
        const errorMessage = screen.getByText(/Passwords do not match./i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('FRONTEND_RESETPWD_6: Shows error message when new password is the same as old password', async () => {
        const oldPassword = 'oldPassword123';

        fireEvent.change(screen.getByPlaceholderText('Enter your new password.'), { target: { value: oldPassword } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your new password.'), { target: { value: oldPassword } });
        const resetPwdButton = screen.getByTestId('resetPwdButton');

        await act(async () => {
            fireEvent.click(resetPwdButton);

            // Mock the axios post call to return a error response
            mockAxios.mockResponse({
                data: {
                    success: false,
                    message: 'New password cannot be the same as the old password.'
                }
            });
        });
        
        // Check if the error message is displayed
        const errorMessage = screen.getByText(/New password cannot be the same as the old password./i);
        expect(errorMessage).toBeInTheDocument();
    });

    test('FRONTEND_RESETPWD_7: Shows success message and redirects to login page', async () => {
        const newPassword = 'NewPassword@123';
        fireEvent.change(screen.getByPlaceholderText('Enter your new password.'), { target: { value: newPassword } });
        fireEvent.change(screen.getByPlaceholderText('Confirm your new password.'), { target: { value: newPassword } });
        const resetPwdButton = screen.getByTestId('resetPwdButton');

        await act(async () => {
            fireEvent.click(resetPwdButton);

            // Mock the axios post call to return a error response
            mockAxios.mockResponse({
                data: {
                    success: true,
                    message: 'Password reset successful. Redirecting to login page...'
                }
            });
        });

        // Use a short delay to allow the navigation to occur
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Wait for the success message to be displayed
        const successMessage = await screen.findByText(/Password reset successful. Redirecting to login page.../i);
        expect(successMessage).toBeInTheDocument();

        // Wait for redirection
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});