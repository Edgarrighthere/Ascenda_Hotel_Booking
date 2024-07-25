import React from 'react'; // Import React
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../src/components/header/Header'; // Adjust path if necessary
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

// Mock the FontAwesomeIcon component
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }) => <i>{icon.iconName}</i>
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([{ term: 'Istana, Singapore' }, { term: 'New York' }, { term: 'Los Angeles' }])
    })
);

// Enable fake timers
beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

describe('Frontend Hotel Search Unit Test', () => {
    beforeEach(() => {
        render(
            <Router>
                <Header />
            </Router>
        );
    });

    it('FRONTEND_HOTEL_SEARCH_1: checks that the destination search input exist', () => {
        // Check if the search bar is present
        const searchInput = screen.getByPlaceholderText('Where are you going?');
        expect(searchInput).toBeInTheDocument();
    });

    it('FRONTEND_HOTEL_SEARCH_2: checks that the date picker input exist', () => {
        // Check if the date picker is present
        const dateSearch = screen.getByTestId('dateSearchInput');
        expect(dateSearch).toBeInTheDocument();
    });

    it('FRONTEND_HOTEL_SEARCH_3: opens date picker dropdown on click', async () => {
        // Click on the date search input to open the date picker
        const dateSearch = screen.getByTestId('dateSearchInput');
        userEvent.click(dateSearch);

        // Wait for the date picker dropdown to appear
        await waitFor(() => {
            const datePickerDropdown = screen.getByTestId('datePickerDropdown'); 
            expect(datePickerDropdown).toBeInTheDocument();
        });
    });

    it('FRONTEND_HOTEL_SEARCH_4: closes date picker dropdown when clicking outside', async () => {
        const dateSearch = screen.getByTestId('dateSearchInput');
        userEvent.click(dateSearch);

        await waitFor(() => {
            const datePickerDropdown = screen.getByTestId('datePickerDropdown');
            expect(datePickerDropdown).toBeInTheDocument();
        });

        // Click outside the date picker dropdown to close it
        userEvent.click(document.body);
    });

    it('FRONTEND_HOTEL_SEARCH_5: checks that the guest info input exist', () => {
        // Check if the guest info section is present
        const guestInfoSearch = screen.getByTestId('guestInfoSearch');
        expect(guestInfoSearch).toBeInTheDocument();
    });

    it('FRONTEND_HOTEL_SEARCH_6: opens guest info dropdown on click', async () => {
        // Click on the guest info search input to open the dropdown
        const guestInfoSearch = screen.getByTestId('guestInfoSearch');
        userEvent.click(guestInfoSearch);

        // Wait for the guest info dropdown to appear
        await waitFor(() => {
            const guestInfoDropdown = screen.getByTestId('guestInfoDropdown'); // Adjust based on actual test id or query
            expect(guestInfoDropdown).toBeInTheDocument();
        });
    });

    it('FRONTEND_HOTEL_SEARCH_7: closes guest info dropdown when clicking outside', async () => {
        // Click on the guest info search input to open the dropdown
        const guestInfoSearch = screen.getByTestId('guestInfoSearch');
        userEvent.click(guestInfoSearch);

        // Wait for the guest info dropdown to appear
        await waitFor(() => {
            const guestInfoDropdown = screen.getByTestId('guestInfoDropdown'); // Adjust based on actual test id or query
            expect(guestInfoDropdown).toBeInTheDocument();
        });

        userEvent.click(document.body);
    });

    it('FRONTEND_HOTEL_SEARCH_8: checks that the search button exist', () => {
        // Check if the search button is present
        const searchButton = screen.getByTestId('searchTest');
        expect(searchButton).toBeInTheDocument();
    });

    it('FRONTEND_HOTEL_SEARCH_9: shows an alert when destination is not entered and search is clicked', async () => {
        const searchButton = screen.getByTestId('searchTest');
        
        // Click the search button with empty destination
        fireEvent.click(searchButton);

        // Wait for the alert to appear
        await waitFor(() => {
            const alertHeading = screen.getByText('Destination not found: Please fill up the options below 😊');
            expect(alertHeading).toBeInTheDocument();
        });
    });
});
