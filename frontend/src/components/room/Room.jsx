import React from 'react';
import './room.css';

const Room = ({ roomType, imageUrl, roomOnlyPrice, breakfastPrice, cancelPolicy }) => {
  return (
    <div className="room">
      <div className="room-image">
        <img src={imageUrl} alt={roomType} />
      </div>
      <div className="room-info">
        <div className="room-type">{roomType}</div>
        <div className="room-pricing">
          <div className="price-option">
            <span className="room-plan">Room Only</span>
            <span className="room-price">${roomOnlyPrice}</span>
          </div>
          <div className="price-option">
            <span className="room-plan">With Breakfast</span>
            <span className="room-price">${breakfastPrice}</span>
          </div>
        </div>
        <div className={`cancel-policy ${cancelPolicy.includes('Non-refundable') ? 'non-refundable' : ''}`}>
          {cancelPolicy}
        </div>
        <button className="select-button">Select</button>
      </div>
    </div>
  );
};

const RoomList = ({ rooms }) => {
  if (!rooms) {
    return null;
  }
  
  return (
    <div className="room-list">
      {rooms.map((room, index) => (
        <Room key={index} {...room} />
      ))}
    </div>
  );
};

export default RoomList;
