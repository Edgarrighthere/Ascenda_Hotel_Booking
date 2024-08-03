import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Confirmation from '../src/pages/confirmation/Confirmation.jsx'; 
import '@testing-library/jest-dom/extend-expect';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ session_id: 'cs_test_a1cbylFPPpqzWQxNf9GSLZ2bEzUa4tSaKmhOMjcCSoKW8iRF2V6qjVLFXu' }),
}));

beforeEach(() => {
  localStorage.setItem('search_details', JSON.stringify({
    checkin: '2024-08-01',
    checkout: '2024-08-02',
    adults: 1,
    children: 0,
    rooms: 1,
  }));

  localStorage.setItem('bookingDetails', JSON.stringify({
    leadGuest: {
      first_name: 'John',
      last_name: 'Doe',
    },
  }));

  localStorage.setItem('specialRequests', 'NIL');
});

afterEach(() => {
  localStorage.clear();
});

test('FRONTEND_CONFIRMATION_1: Renders confirmation page and displays booking details', () => {
  render(
    <BrowserRouter>
      <Confirmation />
    </BrowserRouter>
  );

  expect(screen.getByText(/Your booking has been confirmed!/i)).toBeInTheDocument();
  expect(screen.getByText(/Lead Guest's First Name: John/i)).toBeInTheDocument();
  expect(screen.getByText(/Lead Guest's Last Name: Doe/i)).toBeInTheDocument();
  expect(screen.getByText(/Check-in Date: 2024-08-01/i)).toBeInTheDocument();
  expect(screen.getByText(/Check-out Date: 2024-08-02/i)).toBeInTheDocument();
  expect(screen.getByText(/Adults: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Children: 0/i)).toBeInTheDocument();
  expect(screen.getByText(/Rooms Booked: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Special Requests: NIL/i)).toBeInTheDocument();
  expect(screen.getByText(/Booking reference: cs_test_a1cbylFPPpqzWQxNf9GSLZ2bEzUa4tSaKmhOMjcCSoKW8iRF2V6qjVLFXu/i)).toBeInTheDocument();
});

test('FRONTEND_CONFIRMATION_2: Back to home button navigates to home page', () => {
  render(
    <BrowserRouter>
      <Confirmation />
    </BrowserRouter>
  );

  const backButton = screen.getByText(/Back to Home/i);
  fireEvent.click(backButton);

  expect(mockNavigate).toHaveBeenCalledWith('/');
});
