import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import List from '../src/pages/list/List';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
  }));
  beforeEach(() => {
    useLocation.mockReturnValue({
      state: {
        destination: 'New York',
        startDate: new Date(), endDate: new Date() ,
        options: { adult: 2, children: 0, room: 1 },
      },
    });
  });
  

jest.mock('../src/components/navbar/Navbar', () => () => <div>Navbar Mock</div>);
jest.mock('../src/components/header/Header', () => () => <div>Header Mock</div>);
jest.mock('../src/components/mailList/MailList', () => () => <div>MailList Mock</div>);
jest.mock('../src/components/footer/Footer', () => () => <div>Footer Mock</div>);
jest.mock('../src/components/maps/Map', () => () => <div>Map Mock</div>);
jest.mock('../src/components/searchItem/SearchItem', () => ({ hotel }) => <div>{hotel.name}</div>);
jest.mock('../src/components/ScrollToTop', () => () => <div>ScrollToTop Mock</div>);
jest.mock('../src/controllers/HotelSearch', () => jest.fn());
jest.mock('../src/controllers/HotelFilter', () => jest.fn());
jest.mock('../src/controllers/Paging', () => jest.fn());
jest.mock('../src/controllers/HotelSorting', () => jest.fn());

describe('List component', () => {
  const mockLocationState = {
    destination: 'Paris',
    date: [{ startDate: new Date(), endDate: new Date() }],
    options: { adult: 1, children: 0, rooms: 1 },
    priceRange: [50, 500],
    hotelListings: [{ name: 'Hotel 1' }, { name: 'Hotel 2' }],
    paginatedListings: [{ name: 'Hotel 1' }, { name: 'Hotel 2' }],
    originalListings: [{ name: 'Hotel 1' }, { name: 'Hotel 2' }],
    filteredListings: [{ name: 'Hotel 1' }, { name: 'Hotel 2' }],
    sortedListings: [{ name: 'Hotel 1' }, { name: 'Hotel 2' }],
    currentPage: 1,
    totalPages: 1,
    originalPriceRange: [50, 500],
    originalTotalPages: 1,
  };

  const mockUseLocation = jest.fn().mockReturnValue({
    state: mockLocationState,
  });

  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => mockUseLocation(),
    useParams: () => ({ destinationId: '1', checkin: '2022-01-01', checkout: '2022-01-05', guests: '1', page: '1' }),
    useNavigate: () => jest.fn(),
  }));

  it('renders List component correctly', async () => {
    render(
      <BrowserRouter>
        <List />
      </BrowserRouter>
    );

    // Check if Navbar, Header, and other components are rendered
    expect(screen.getByText('Navbar Mock')).toBeInTheDocument();
    expect(screen.getByText('Header Mock')).toBeInTheDocument();
    expect(screen.getByText('MailList Mock')).toBeInTheDocument();
    expect(screen.getByText('Footer Mock')).toBeInTheDocument();
    expect(screen.getByText('Map Mock')).toBeInTheDocument();

    // Check if hotels are rendered
    await waitFor(() => {
      expect(screen.getByText('Hotel 1')).toBeInTheDocument();
      expect(screen.getByText('Hotel 2')).toBeInTheDocument();
    });

    // Mock the search button click
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    // Ensure the search button click doesn't break anything
    expect(screen.getByText('Hotel 1')).toBeInTheDocument();
    expect(screen.getByText('Hotel 2')).toBeInTheDocument();
  });
});
