import React from 'react';
import './room.css';
import axios from 'axios';

const Room = ({ roomType, imageUrl, roomOnlyPrice, breakfastPrice, cancelPolicy }) => {
  const handleSelectClick = async () => {
    try {
      const response = await axios.post('http://localhost:5001/checkout', {
        roomType,
        roomOnlyPrice,
        breakfastPrice,
        cancelPolicy,
      });

      const { id } = response.data;
      const stripe = window.Stripe('pk_test_51PcmhS2Ndp6I7VS5ncMBMPsAp2sYzZdhgrhqVffCHZParhBEMHGfq4cyIuEKJ9COzJ4oNYMuoUu1QKy7OHPYmqT000EIYgg88w'); // Stripe publishable key 
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
    }
  };

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
        <button className="select-button" onClick={handleSelectClick}>Select</button>
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
