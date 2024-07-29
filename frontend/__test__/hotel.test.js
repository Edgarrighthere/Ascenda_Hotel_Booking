import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hotel from '../src/pages/hotel/Hotel';

// Mock useNavigate and useLocation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

// Mock fetch
const mockFetch = (data) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(data),
    })
  );
};

// Mock components
jest.mock('../src/components/navbar/Navbar', () => () => <div>Navbar Mock</div>);
jest.mock('../src/components/header/Header', () => () => <div>Header Mock</div>);
jest.mock('../src/components/mailList/MailList', () => () => <div>MailList Mock</div>);
jest.mock('../src/components/footer/Footer', () => () => <div>Footer Mock</div>);
jest.mock('../src/components/trustYouScore/TrustYouScore', () => () => <div>TrustYouScore Mock</div>);
jest.mock('../src/components/categories/Categories', () => () => <div>Categories Mock</div>);
jest.mock('../src/components/amenities/Amenities', () => () => <div>Amenities Mock</div>);
jest.mock('../src/components/room/Room', () => () => <div>RoomList Mock</div>);
jest.mock('../src/components/maps/Map', () => () => <div>Map Mock</div>);

describe('Frontend Hotel Component Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock data
  });

  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('FRONTEND_HOTEL_1: Renders without crashing and displays hotel information',  () => {
    const mockData = {
      name: 'Test Hotel',
      address: '123 Test St',
      number_of_images: 5,
      image_details: {
        prefix: 'http://example.com/image',
        suffix: '.jpg',
      },
      trustyou: {
        score: {
          overall: 4.5,
          kaligo_overall: 4.3,
          solo: 4.0,
          couple: 4.2,
          family: 4.1,
          business: 4.0,
        },
      },
      amenities: ['Free Wi-Fi', 'Parking'],
      latitude: 40.7128,
      longitude: -74.006,
      description: '<p>Great hotel in the city center</p>',
      rooms_available: [
        {
          roomNormalizedDescription: 'Deluxe Room',
          images: ['http://example.com/room1.jpg'],
          chargeableRate: 100,
          freeCancellation: true,
        },
      ],
    };
    mockFetch(mockData);

    render(
      <BrowserRouter initialEntries={['/hotels/1']}>
        <Routes>
          <Route path="/hotels/:id" element={<Hotel />} />
        </Routes>
      </BrowserRouter>
    );

     waitFor(() => {
      // Check hotel name, address, and description
      expect(screen.getByText('Test Hotel')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
      expect(screen.getByText(/Great hotel in the city center/)).toBeInTheDocument();
      
      // Check amenities
      expect(screen.getByText('Free Wi-Fi')).toBeInTheDocument();
      expect(screen.getByText('Parking')).toBeInTheDocument();
      
      // Check room information
      expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('Free Cancellation')).toBeInTheDocument();

      // Check for image
      const image = screen.getByAltText('Hotel image');
      expect(image).toHaveAttribute('src', 'http://example.com/image0.jpg');
    });
  });

  it('FRONTEND_HOTEL_2: Loading element present',  () => {
    render(
      <BrowserRouter initialEntries={['/hotels/1']}>
        <Routes>
          <Route path="/hotels/:id" element={<Hotel />} />
        </Routes>
      </BrowserRouter>
    );

     waitFor(() => {
      const loadingText = screen.getByAltText(/loading.../i);
      expect(loadingText).toBeInTheDocument();
    });
  });
});

describe('Frontend Hotel Component Unit Test', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock data
  });

  afterEach(() => {
    jest.resetAllMocks(); // Reset all mocks after each test
  });

  it('FRONTEND_HOTEL_3: Handles fetch error gracefully',  () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    render(
      <BrowserRouter initialEntries={['/hotels/1']}>
        <Routes>
          <Route path="/hotels/:id" element={<Hotel />} />
        </Routes>
      </BrowserRouter>
    );

     waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('FRONTEND_HOTEL_4: Displays message when no rooms are available',  () => {
    const mockData = {
      name: 'Test Hotel',
      address: '123 Test St',
      number_of_images: 5,
      image_details: {
        prefix: 'http://example.com/image',
        suffix: '.jpg',
      },
      trustyou: {
        score: {
          overall: 4.5,
          kaligo_overall: 4.3,
          solo: 4.0,
          couple: 4.2,
          family: 4.1,
          business: 4.0,
        },
      },
      amenities: ['Free Wi-Fi', 'Parking'],
      latitude: 40.7128,
      longitude: -74.006,
      description: '<p>Great hotel in the city center</p>',
      rooms_available: [],
    };
    mockFetch(mockData);

    render(
      <BrowserRouter initialEntries={['/hotels/1']}>
        <Routes>
          <Route path="/hotels/:id" element={<Hotel />} />
        </Routes>
      </BrowserRouter>
    );

     waitFor(() => {
      expect(screen.getByText(/no rooms available/i)).toBeInTheDocument();
    });
  });

  it('FRONTEND_HOTEL_5: Displays dynamic content correctly',  () => {
    const mockData = {
      name: 'Dynamic Hotel',
      address: '456 Dynamic St',
      number_of_images: 3,
      image_details: {
        prefix: 'http://example.com/dynamic-image',
        suffix: '.jpg',
      },
      trustyou: {
        score: {
          overall: 4.7,
          kaligo_overall: 4.6,
          solo: 4.3,
          couple: 4.5,
          family: 4.4,
          business: 4.3,
        },
      },
      amenities: ['Spa', 'Gym'],
      latitude: 41.7128,
      longitude: -75.006,
      description: '<p>A dynamic hotel experience</p>',
      rooms_available: [
        {
          roomNormalizedDescription: 'Standard Room',
          images: ['http://example.com/dynamic-room1.jpg'],
          chargeableRate: 120,
          freeCancellation: false,
        },
      ],
    };
    mockFetch(mockData);

    render(
      <BrowserRouter initialEntries={['/hotels/1']}>
        <Routes>
          <Route path="/hotels/:id" element={<Hotel />} />
        </Routes>
      </BrowserRouter>
    );

     waitFor(() => {
      // Check hotel name, address, and description
      expect(screen.getByText('Dynamic Hotel')).toBeInTheDocument();
      expect(screen.getByText('456 Dynamic St')).toBeInTheDocument();
      expect(screen.getByText(/A dynamic hotel experience/)).toBeInTheDocument();
      
      // Check amenities
      expect(screen.getByText('Spa')).toBeInTheDocument();
      expect(screen.getByText('Gym')).toBeInTheDocument();
      
      // Check room information
      expect(screen.getByText('Standard Room')).toBeInTheDocument();
      expect(screen.getByText('$120')).toBeInTheDocument();
      expect(screen.getByText('No Free Cancellation')).toBeInTheDocument();

      // Check for image
      const image = screen.getByAltText('Hotel image');
      expect(image).toHaveAttribute('src', 'http://example.com/dynamic-image0.jpg');
    });
  });
});
