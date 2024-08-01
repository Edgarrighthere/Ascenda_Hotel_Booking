import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import Account from '../src/pages/authentication/Account';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        state: {
            email: 'test@example.com',
            salutation: 'Mr.',
            firstName: 'John',
            lastName: 'Doe',
            countryCode: '+1',
            phoneNumber: '1234567890',
            isGuest: false
        }
    })
}));

const mockUser = {
    email: 'test@example.com',
    salutation: 'Mr.',
    firstName: 'John',
    lastName: 'Doe',
    countryCode: '+1',
    phoneNumber: '1234567890',
    isGuest: false
};

const setup = (user = mockUser) => {
    return render(
        <Router>
            <Account location={{ state: user }} />
        </Router>
    );
};

describe('Frontend Account Unit and Integration Test', () => {
    test('FRONTEND_ACCOUNT_1: Renders user information correctly', async () => {
        axios.get.mockResolvedValueOnce({ data: mockUser });

        setup();

        // Wait for the component to update after fetching user details
        await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());

        // Assertions to check if the rendered content matches the mock user data
        expect(screen.getByTestId('userEmail').textContent.trim()).toBe(mockUser.email);
        expect(screen.getByTestId('userName').textContent.trim()).toBe(`${mockUser.salutation} ${mockUser.firstName} ${mockUser.lastName}`);
        expect(screen.getByTestId('userPhoneNumber').textContent.trim()).toBe(`${mockUser.countryCode} ${mockUser.phoneNumber}`);
    });

    test('FRONTEND_ACCOUNT_2: Handles fetch user details error', async () => {
        axios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
        setup();
    
        await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
        
        expect(screen.getByTestId('error').textContent).toContain('Failed to fetch user details');
    });

    test('FRONTEND_ACCOUNT_3: Verifies deleteAccountButton is present and launches deleteAccountModal', async () => {
        axios.get.mockResolvedValueOnce({ data: mockUser });
        axios.post.mockResolvedValueOnce({});
    
        setup();
    
        // Mock state to skip loading phase
        await waitFor(() => {
            // Wait for the component to update and the loading state to be cleared
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    
        // Ensure the deleteAccountButton is rendered
        const deleteAccountButton = screen.getByTestId('deleteAccountButton');
        expect(deleteAccountButton).toBeInTheDocument();
    
        // Open the modal
        fireEvent.click(deleteAccountButton);
    
        // Ensure the deleteAccountModal is now visible
        await waitFor(() => {
            expect(screen.getByTestId('deleteAccountModal')).toBeInTheDocument();
        });

        expect(screen.getByText('Are you sure you want to delete your account? This action cannot be undone.')).toBeInTheDocument();

        expect(screen.getByTestId('confirmDelete')).toBeInTheDocument();
        expect(screen.getByTestId('cancelDelete')).toBeInTheDocument();
    });
});