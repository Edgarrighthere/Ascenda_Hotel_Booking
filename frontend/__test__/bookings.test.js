import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Bookings from '../src/pages/authentication/Bookings';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');

const mockBookings = [
  {
    bookingDetails: {
      leadGuest: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
      specialRequests: 'Non-smoking room',
      roomType: 'Standard',
      roomOnlyPrice: 100,
      breakfastPrice: 20,
      cancelPolicy: 'Non-refundable',
    },
    searchDetails: {
      checkin: '11/01/2024',
      checkout: '11/03/2024',
      adults: 1,
      children: 0,
      rooms: 1,
      days: 2,
    },
    hotelDetails: {
      destination: 'Los Angeles',
      address: '123 Hollywood Blvd',
      description: 'Standard room with city view.',
    },
  },
  {
    bookingDetails: {
      leadGuest: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
      },
      specialRequests: 'Non-smoking room',
      roomType: 'Standard',
      roomOnlyPrice: 100,
      breakfastPrice: 20,
      cancelPolicy: 'Non-refundable',
    },
    searchDetails: {
      checkin: '11/01/2024',
      checkout: '11/03/2024',
      adults: 1,
      children: 0,
      rooms: 1,
      days: 2,
    },
    hotelDetails: {
      destination: 'Los Angeles',
      address: '123 Hollywood Blvd',
      description: 'Standard room with city view.',
    },
  }
];

describe('Bookings Component', () => {
  beforeEach(() => {
    localStorage.setItem('email', 'john.doe@example.com');
    axios.get.mockResolvedValue({ data: mockBookings });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('FRONTEND_BOOKINGS_DISPLAY_1: Renders without crashing', async () => {
    localStorage.clear();
    axios.get.mockResolvedValue({ data: mockBookings });

    await act(async () => {
      render(
        <MemoryRouter>
          <Bookings />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Current Bookings')).toBeInTheDocument();
  });

  test('FRONTEND_BOOKINGS_DISPLAY_2: fetches and displays bookings correctly', async () => {
    axios.get.mockResolvedValue({ data: mockBookings });

    await act(async () => {
      render(
        <MemoryRouter>
          <Bookings />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText((content, element) => {
      return content.includes('Jane');
    })).toBeInTheDocument();
    const emailElement = await screen.findByTestId('email');
    expect(emailElement).toHaveTextContent('john.doe@example.com');
    const priceElement = await screen.findByTestId('roomOnlyPrice');
    expect(priceElement).toHaveTextContent('100');
    const dateElement =  await screen.findByTestId('checkInDate');
    expect(dateElement).toHaveTextContent('01/11/2024');
    expect(await screen.findByText((content, element) => {
      return content.includes('Los Angeles');
    })).toBeInTheDocument();

  });

  test('FRONTEND_BOOKINGS_DISPLAY_3: displays error message when fetching bookings fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch bookings.'));

    await act(async () => {
      render(
        <MemoryRouter>
          <Bookings />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Only registered users can view their existing bookings.')).toBeInTheDocument();
    });
  });

  
  test('FRONTEND_BOOKINGS_DISPLAY_4: Navigates bookings with Next and Prev buttons', async () => {
    render(
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    );
  
    // Initial state should display the first booking
    expect(await screen.findByText((content) => content.includes('Jane'))).toBeInTheDocument();
  
    // Navigate to the next booking
    fireEvent.click(screen.getByText('Next'));
    expect(await screen.findByText((content) => content.includes('John'))).toBeInTheDocument();
  
    // Navigate back to the previous booking
    fireEvent.click(screen.getByText('Prev'));
    expect(await screen.findByText((content) => content.includes('Jane'))).toBeInTheDocument();
  });
  
});