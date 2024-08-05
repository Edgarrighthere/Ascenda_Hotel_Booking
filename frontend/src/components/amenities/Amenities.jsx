import React from "react";
import "./amenities.css";

const Amenities = ({ amenities }) => {
  return (
    <div className="amenities-container">
      <h1 className="amenities-title">Amenities</h1>
      <ul className="amenities-list">
        {Object.entries(amenities).map(([key, value]) => (
          <li key={key} className="amenities-item">
            {key}
            {/* {value && key.replace(/([A-Z])/g, " $1").trim()} Convert camelCase to words */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Amenities;
