import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Hotel from './Hotel';

// Mock data for testing
const mockHotelData = {
  id: '1',
  destinationId: '100',
  hotel: { id: '1', price: 114 },
  destination: 'Some Destination',
  checkin: '2024-08-01',
  checkout: '2024-08-02',
  guests: 2,
  price: 114,
  rawinfo: {
    name: 'Test Hotel',
    address: '123 Test Street',
    number_of_images: 3,
    image_details: { prefix: 'http://example.com/', suffix: '.jpg' },
    trustyou: {
      score: {
        overall: 8.5,
        kaligo_overall: 7.0,
        solo: 7.5,
        couple: 8.0,
        family: 9.0,
        business: 6.0,
      },
    },
    amenities: ['Free WiFi', 'Breakfast Included'],
    description: 'This is a test description for the hotel.',
    latitude: 40.7128,
    longitude: -74.0060,
    rooms_available: [
      {
        roomNormalizedDescription: 'Deluxe Room',
        images: ['http://example.com/room1.jpg'],
        chargeableRate: 150,
        freeCancellation: true,
      },
      // Add more room variations if needed
    ],
  },
};

describe('Hotel Component', () => {
  test('renders the Hotel component with mock data', async () => {
    // Mock the fetch call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockHotelData.rawinfo),
      })
    );

    render(
      <MemoryRouter initialEntries={[`/hotels/${mockHotelData.id}`]}>
        <Routes>
          <Route path="/hotels/:id" element={<Hotel />} />
        </Routes>
      </MemoryRouter>
    );

    // Assertions to verify UI elements
    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getByText('This is a test description for the hotel.')).toBeInTheDocument();
    expect(screen.getByText('Free WiFi')).toBeInTheDocument();
    expect(screen.getByText('Breakfast Included')).toBeInTheDocument();

    // Wait for the images to load and verify they are displayed
    await waitFor(() => {
      expect(screen.getAllByRole('img')).toHaveLength(mockHotelData.rawinfo.number_of_images);
    });

    // Check if the booking button is present
    expect(screen.getByText('Book Now!')).toBeInTheDocument();
  });
});
