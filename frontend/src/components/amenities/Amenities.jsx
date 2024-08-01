import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Amenities = () => {
  const [amenities, setAmenities] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get('/api/amenities'); // Replace with actual API endpoint
        setAmenities(response.data);
      } catch (error) {
        setError('Failed to load amenities');
      }
    };

    fetchAmenities();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!amenities || Object.keys(amenities).length === 0) {
    return <div>No Amenities Available</div>;
  }

  return (
    <div>
      <h1 className="amenities-title">Amenities</h1>
      <ul className="amenities-list">
        {Object.entries(amenities).map(([key, value]) => (
          <li key={key} className="amenities-item">
            {key}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Amenities;
