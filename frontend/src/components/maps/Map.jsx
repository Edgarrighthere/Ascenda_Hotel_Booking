import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './map.css';

const containerStyle = {
  width: '100%',
  height: '100%',
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
    zoomControl: false,
    draggable: true, // Disable dragging the map
    scrollwheel: true, // Disable zooming using scrollwheel
    disableDoubleClickZoom: false, // Disable zooming using double click
  };

  const [isMapEnlarged, setIsMapEnlarged] = useState(false);

  const toggleMapSize = () => {
    setIsMapEnlarged(!isMapEnlarged);
  };

  return isLoaded ? (
    <div className={`map-container ${isMapEnlarged ? 'enlarged' : ''}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: lat || center.lat, lng: lng || center.lng }}
        zoom={10}
        options={isMapEnlarged ? mapOptions : { ...mapOptions, draggable: false, scrollwheel: false, disableDoubleClickZoom: true }}
      >
        {lat && lng && (
          <Marker 
            position={{ lat, lng }}
          />
        )}
      </GoogleMap>
      {!isMapEnlarged && (
        <button className="toggle-map-button-map" onClick={toggleMapSize}>
          View Map
        </button>
      )}
      {isMapEnlarged && (
        <button className="toggle-map-button-list" onClick={toggleMapSize}>
          View List
        </button>
      )}
    </div>
  ) : <></>;
};

export default Map;
