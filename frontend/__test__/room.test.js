import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RoomList from '../src/components/room/Room';

// Mock fetch
const mockFetch = (data) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
    })
  );
};

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Room component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock data
  });

  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  const mockRoomInfo = {
    roomType: 'Deluxe Room',
    imageUrl: 'http://example.com/room.jpg',
    roomOnlyPrice: 100,
    breakfastPrice: 120,
    cancelPolicy: 'Free Cancellation',
    all_room_info: {
      roomAdditionalInfo: {
        breakfastInfo: 'hotel_detail_breakfast_included',
        displayFields: {
          maxOccupancy: 2,
          bedType: 'Queen Bed',
          surcharges: [
            { type: 'serviceFee', amount: 10.0 },
            { type: 'cleaningFee', amount: 5.0 },
          ],
        },
      },
      amenities: ['wifi', 'pool'],
    },
  };

  it('ROOM_1: Renders room information without crashing', () => {
    render(<RoomList rooms={[mockRoomInfo]} />);

    waitFor(() => {
      expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
      expect(screen.getByText('Room Only')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
      expect(screen.getByText('Breakfast Included || Price Inclusive of Breakfast')).toBeInTheDocument();
      expect(screen.getByText('Free Cancellation')).toBeInTheDocument();
    });
  });

  it('ROOM_2: Toggles see more and see less', () => {
    render(<RoomList rooms={[mockRoomInfo]} />);

    const seeMoreButton = screen.getByText('See More');
    fireEvent.click(seeMoreButton);

    waitFor(() => {
      expect(screen.getByText('Max Occupancy: 2')).toBeInTheDocument();
      expect(screen.getByText('Bed Type: Queen Bed')).toBeInTheDocument();
      expect(screen.getByText('Service Fee: $10.00')).toBeInTheDocument();
      expect(screen.getByText('Cleaning Fee: $5.00')).toBeInTheDocument();
      expect(screen.getByText('Amenities:')).toBeInTheDocument();
      expect(screen.getByText('Wifi')).toBeInTheDocument();
      expect(screen.getByText('Pool')).toBeInTheDocument();

      const seeLessButton = screen.getByText('See Less');
      fireEvent.click(seeLessButton);

      expect(screen.queryByText('Max Occupancy: 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Bed Type: Queen Bed')).not.toBeInTheDocument();
    });
  });

  it('ROOM_3: Handles select button click', () => {
    render(<RoomList rooms={[mockRoomInfo]} />);

    const selectButton = screen.getByText('Select');
    fireEvent.click(selectButton);

    waitFor(() => {
      expect(selectButton).toHaveTextContent('Please Wait....');
    });
  });

  it('ROOM_4: Displays message when no rooms are available', () => {
    render(<RoomList rooms={[]} />);

    waitFor(() => {
      expect(screen.getByText(/No Rooms Available/i)).toBeInTheDocument();
    });
  });

  it('ROOM_5: Displays dynamic content correctly', () => {
    const dynamicRoomInfo = {
      roomType: 'Standard Room',
      imageUrl: 'http://example.com/standard-room.jpg',
      roomOnlyPrice: 150,
      breakfastPrice: 170,
      cancelPolicy: 'No Free Cancellation',
      all_room_info: {
        roomAdditionalInfo: {
          breakfastInfo: 'hotel_detail_breakfast_included',
          displayFields: {
            maxOccupancy: 3,
            bedType: 'King Bed',
            surcharges: [
              { type: 'serviceFee', amount: 12.0 },
              { type: 'cleaningFee', amount: 6.0 },
            ],
          },
        },
        amenities: ['gym', 'spa'],
      },
    };

    render(<RoomList rooms={[dynamicRoomInfo]} />);

    waitFor(() => {
      // Check room information
      expect(screen.getByText('Standard Room')).toBeInTheDocument();
      expect(screen.getByText('Room Only')).toBeInTheDocument();
      expect(screen.getByText('$150.00')).toBeInTheDocument();
      expect(screen.getByText('Breakfast Included || Price Inclusive of Breakfast')).toBeInTheDocument();
      expect(screen.getByText('No Free Cancellation')).toBeInTheDocument();

      // Check amenities
      expect(screen.getByText('Gym')).toBeInTheDocument();
      expect(screen.getByText('Spa')).toBeInTheDocument();
    });
  });
});
