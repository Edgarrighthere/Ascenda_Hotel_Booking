import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './map.css';

const containerStyle = {
  width: '100%',
  height: '250px',
};

const center = {
  lat: 0, // Default to 0 if lat is null
  lng: 0, // Default to 0 if lng is null
};

const Map = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyC3_c1gDPRAZHr9Vrg3P_upatj9SRVmPEs',
  });

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: lat || center.lat, lng: lng || center.lng }}
        zoom={10}
        options={mapOptions}
      >
        {lat && lng && (
          <Marker 
            position={{ lat, lng }}
          />
        )}
      </GoogleMap>
    </div>
  ) : <></>;
};

export default Map;
