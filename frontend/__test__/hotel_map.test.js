import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Map from '../src/components/maps/Map';

// Mock the useJsApiLoader hook from @react-google-maps/api
jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true }),
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  Marker: ({ position }) => <div data-testid="marker" data-position={JSON.stringify(position)}>Marker</div>,
}));

describe('Frontend Map Component Integration Test', () => {
  it('FRONTEND_HOTEL_MAP_1: Should render the map with correct center position', () => {
    render(
    <Map 
      lat={37.7749} 
      lng={-122.4194} 
    />);
    
    // Check if the GoogleMap component is rendered
    const mapElement = screen.getByTestId('google-map'); 
    expect(mapElement).toBeInTheDocument();
    
    // Check if the Marker is rendered
    const markerElement = screen.getByTestId('marker');
    expect(markerElement).toBeInTheDocument();
  });

  it('FRONTEND_HOTEL_MAP_2: Should toggle between view map and view list', () => {
    render(
    <Map 
      lat={37.7749} 
      lng={-122.4194} 
    />);
    
    // Check the initial button state
    const viewMapButton = screen.getByTestId('view-map');
    expect(viewMapButton).toBeInTheDocument();
    
    // Simulate button click to enlarge the map
    fireEvent.click(viewMapButton);
    
    // After clicking, check if the button text changes to "View List"
    const viewListButton = screen.getByTestId('view-list');
    expect(viewListButton).toBeInTheDocument();
    
    // Simulate button click to return to the map view
    fireEvent.click(viewListButton);
  });
});

describe('Frontend Map Component Unit Test', () => {
  it('FRONTEND_HOTEL_MAP_3: Should update marker position when lat and lng props change', () => {
    const { rerender } = render(
      <Map 
        lat={37.7749} 
        lng={-122.4194} 
      />
    );

    // Check the initial marker position
    let markerElement = screen.getByTestId('marker');
    expect(markerElement).toHaveAttribute('data-position', JSON.stringify({ lat: 37.7749, lng: -122.4194 }));
    
    // Update the props with new lat and lng
    act(() => {
      rerender(<Map lat={34.0522} lng={-118.2437} />);
    });

    // Check if the marker position has been updated
    markerElement = screen.getByTestId('marker');
    expect(markerElement).toHaveAttribute('data-position', JSON.stringify({ lat: 34.0522, lng: -118.2437 }));
  });
});
