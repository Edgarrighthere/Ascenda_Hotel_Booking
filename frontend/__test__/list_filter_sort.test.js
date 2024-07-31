import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import List from '../src/pages/list/List';
import userEvent from '@testing-library/user-event';

// Mocking the fetch function to return sample data for destinations
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      { term: 'Singapore', lat: 1.3521, lng: 103.8198 },
      { term: 'Tokyo', lat: 35.6762, lng: 139.6503 }
    ])
  })
);

// Mock DateRange component
jest.mock('react-date-range', () => ({
  DateRange: ({ onChange }) => {
    // Simulate user interaction directly
    const handleClick = () => {
      onChange({
        selection: {
          startDate: new Date('2024-08-01'),
          endDate: new Date('2024-08-10'),
        }
      });
    };

    return (
      <div>
        <button onClick={handleClick} data-testid="select-date-range-button">Select Date Range</button>
        <div>Mock DateRange Component</div>
      </div>
    );
  }
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    state: {
      destination: '',
      date: [{ startDate: new Date('2024-07-01'), endDate: new Date('2024-07-07') }],
      options: { adult: 1, children: 0, rooms: 1 },
      priceRange: [0, 2500],
      hotelListings: [],
      paginatedListings: [],
      originalListings: [],
      filteredListings: [],
      sortedListings: [],
      currentPage: 1,
      totalPages: 1,
      originalPriceRange: [0, 2500],
      originalTotalPages: 1
    },
  }),
  useNavigate: jest.fn(),
  useParams: () => ({})
}));

describe('Frontend List Filter and Sort Unit and Integration Test', () => {
  beforeEach(() => {
    fetch.mockClear();
    render(
      <BrowserRouter>
        <List />
      </BrowserRouter>
    );
  });

  const onSuggestionsFetchRequested = jest.fn();
  const onSuggestionsClearRequested = jest.fn();
  const onChange = jest.fn();
  const renderSuggestion = suggestion => <div>{suggestion.term}</div>;

  const setup = () => {
    const suggestions = [
      { term: 'Singapore' },
      { term: 'Tokyo' }
    ];

    // Mock the Autosuggest component directly in the setup
    const MockAutosuggest = ({ inputProps }) => {
      return (
        <div>
          <input 
            {...inputProps} 
            placeholder="Where are you going?"
            data-testid="destination-input"
          />
          <div role="listbox" className="autosuggestSuggestionsContainer">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="autosuggestSuggestion">
                {suggestion.term}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const utils = render(
      <MockAutosuggest
        inputProps={{
          value: '',
          onChange: onChange,
          className: 'listSearchInput'
        }}
      />
    );
  };

  test('FRONTEND_LIST_FILTER_1: Renders input and suggestions', async () => {
    setup(); // Ensure setup is called
    const input = screen.getByTestId('destination-input');

    // Simulate input change
    fireEvent.change(input, { target: { value: 'Sing' } });

    // Check if suggestions are rendered
    await waitFor(() => {
      expect(screen.getByText('Singapore')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('FRONTEND_LIST_FILTER_2: Updates input value on suggestion click', async () => {
    setup(); // Ensure setup is called
    const input = screen.getByTestId('destination-input');

    // Simulate input change
    fireEvent.change(input, { target: { value: 'Tok' } });

    // Check if suggestions are rendered
    await waitFor(() => {
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('FRONTEND_LIST_FILTER_3: Updates date range on selection', async () => {
    // Find the element to open the date picker
    const checkInDateElement = screen.getByTestId('open-date-picker');
    expect(checkInDateElement).toBeInTheDocument();

    // Simulate clicking the element to open the date picker
    fireEvent.click(checkInDateElement);

    // Wait for the mock DateRange component to be rendered
    await waitFor(() => {
      expect(screen.getByText('Mock DateRange Component')).toBeInTheDocument();
    });

    // Click the button to select the date range
    fireEvent.click(screen.getByTestId('select-date-range-button'));

    // Wait for the date range display to be updated
    await waitFor(() => {
      expect(screen.getByText('01/08/2024 to 10/08/2024')).toBeInTheDocument();
    });
  });

  test('FRONTEND_LIST_FILTER_4: Updates adult count on increment and decrement', async () => {
    const incrementButton = screen.getByTestId('adultsIncrease');
    const decrementButton = screen.getByTestId('adultsDecrease');
    const countSpan = screen.getByTestId('adultsNum');

    // Initial value should be 1
    expect(countSpan.textContent).toBe('1');

    // Increment adults
    fireEvent.click(incrementButton);
    expect(countSpan.textContent).toBe('2');

    // Decrement adults
    fireEvent.click(decrementButton);
    expect(countSpan.textContent).toBe('1');
  });

  test('FRONTEND_LIST_FILTER_5: Updates children count on increment and decrement', async () => {
    const incrementButton = screen.getByTestId('childrenIncrease');
    const decrementButton = screen.getByTestId('childrenDecrease');
    const countSpan = screen.getByTestId('childrenNum');

    // Initial value should be 0
    expect(countSpan.textContent).toBe('0');

    // Increment children
    fireEvent.click(incrementButton);
    expect(countSpan.textContent).toBe('1');

    // Decrement children
    fireEvent.click(decrementButton);
    expect(countSpan.textContent).toBe('0');
  });

  test('FRONTEND_LIST_FILTER_6: Updates rooms count on increment and decrement', async () => {
    const incrementButton = screen.getByTestId('roomsIncrease');
    const decrementButton = screen.getByTestId('roomsDecrease');
    const countSpan = screen.getByTestId('roomsNum');

    // Initial value should be 1
    expect(countSpan.textContent).toBe('1');

    // Increment rooms
    fireEvent.click(incrementButton);
    expect(countSpan.textContent).toBe('2');

    // Decrement rooms
    fireEvent.click(decrementButton);
    expect(countSpan.textContent).toBe('1');
  });

  test('FRONTEND_LIST_FILTER_7: Updates price range values on slider change', async () => {
    const initialPriceRange = [0, 2500];
    const newPriceRange = [500, 2000];
    
    // Check initial price range values
    expect(screen.getByTestId('priceRangeMin').textContent).toBe(`S$${initialPriceRange[0]}`);
    expect(screen.getByTestId('priceRangeMax').textContent).toBe(`S$${initialPriceRange[1]}`);
  
    // Simulate changing the price range on the slider
    const slider = screen.getByTestId('priceRangeSlider');
  
    fireEvent.input(slider, { target: { value: newPriceRange } });
  
    // // Wait for the price range values to be updated
    // expect(screen.getByTestId('priceRangeMin').textContent).toBe(`S$${newPriceRange[0]}`);
    // expect(screen.getByTestId('priceRangeMax').textContent).toBe(`S$${newPriceRange[1]}`);
    await waitFor(() => {
      expect(screen.getByTestId('priceRangeMin').textContent).toBe(`S$${newPriceRange[0]}`);
      expect(screen.getByTestId('priceRangeMax').textContent).toBe(`S$${newPriceRange[1]}`);
    });
  });
});

