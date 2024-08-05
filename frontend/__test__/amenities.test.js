import React from 'react';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';
import Amenities from '../src/components/amenities/Amenities';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.setTimeout(10000);

afterEach(() => {
  mockAxios.reset();
  cleanup();
});

describe('Amenities Component Unit and Integration Test', () => {
  test('AMENITIES_1: Renders amenities list correctly', async () => {
    const amenitiesData = {
      wifi: 'Free Wifi',
      pool: 'Swimming Pool',
      gym: 'Gym',
    };

    mockAxios.get.mockResolvedValueOnce({ data: amenitiesData });

    await act(async () => {
      render(<Amenities />);
    });

    await waitFor(() => {
      Object.entries(amenitiesData).forEach(([key, value]) => {
        expect(screen.getByText(key)).toBeInTheDocument();
      });
    });
  });

  test('AMENITIES_2: Displays a message when no amenities are available', async () => {
    mockAxios.get.mockResolvedValueOnce({ data: {} });

    await act(async () => {
      render(<Amenities />);
    });

    await waitFor(() => {
      expect(screen.getByText(/No Amenities Available/i)).toBeInTheDocument();
    });
  });

  test('AMENITIES_3: Handles errors gracefully', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    await act(async () => {
      render(<Amenities />);
    });

    await waitFor(() => {
      expect(screen.getByText(/Failed to load amenities/i)).toBeInTheDocument();
    });
  });

  test('AMENITIES_4: Displays additional information on clicking "See More"', async () => {
    const amenitiesData = {
      wifi: 'Free Wifi',
      pool: 'Swimming Pool',
      gym: 'Gym',
    };

    mockAxios.get.mockResolvedValueOnce({ data: amenitiesData });

    await act(async () => {
      render(<Amenities />);
    });

    await waitFor(() => {
      Object.entries(amenitiesData).forEach(([key, value]) => {
        const seeMoreButton = screen.getByText(`See More about ${key}`);
        userEvent.click(seeMoreButton);

        expect(screen.getByText(value)).toBeInTheDocument();
      });
    });
  });
});
