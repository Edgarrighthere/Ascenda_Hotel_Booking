import React, { useState } from 'react';
import { useEffect } from 'react';
import './room.css';
import axios from 'axios';

const Room = ({ roomType, imageUrl, roomOnlyPrice, breakfastPrice, cancelPolicy, all_room_info }) => {
const [seeMore, setSeeMore] = useState(false)
const [selectButton, setSelectButton] = useState("Select");
const[breakfast, setBreakfast] = useState("No Breakfast Combo")
console.log(JSON.stringify(all_room_info));


useEffect(() => {
    if (
      all_room_info.roomAdditionalInfo.breakfastInfo ===
      "hotel_detail_room_only"
    ) {
      setBreakfast("No Breakfast Combo || Hotel Room Only");
    } else if (
      all_room_info.roomAdditionalInfo.breakfastInfo ===
      "hotel_detail_breakfast_included"
    ) {
      setBreakfast("Breakfast Included || Price Inclusive of Breakfast");
    }
  }, [all_room_info.roomAdditionalInfo.breakfastInfo]);

  const handleSelectClick = async () => {
    setSelectButton("Please Wait....");
    try {
      const response = await axios.post('http://localhost:4999/checkout', {
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

  const handleSeeMoreClick = () =>{
    setSeeMore(!seeMore);
  }

  const camelToText = (camelCase) => {
    return camelCase
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camel case
      .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
  };

  const renderDisplayFields = () => {
    if (!all_room_info || !all_room_info.roomAdditionalInfo || !all_room_info.roomAdditionalInfo.displayFields) return null;

    const { displayFields } = all_room_info.roomAdditionalInfo;

    return Object.entries(displayFields).map(([key, value]) => {
      if (key === 'surcharges' && Array.isArray(value) && value.length > 0) {
        return (
          <div key={key}>
            <h3>Surcharges:</h3>
            {value.length > 0 ? (
              value.map((surcharge, index) => (
                <p key={index}>{camelToText(surcharge.type)}: ${surcharge.amount.toFixed(2)}</p>
              ))
            ) : (
              <p>None</p>
            )}
          </div>
        );
      }

      const displayKey = camelToText(key);
      const displayValue = value === null || (Array.isArray(value) && value.length === 0) ? 'None' : (typeof value === 'number' ? `$${value.toFixed(2)}` : value);

      return (
        <p key={key}>{displayKey}: {displayValue}</p>
      );
    });
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
            <span className="room-price">${roomOnlyPrice.toFixed(2)}</span>
          </div>
          <div className="price-option">
            <span className="room-plan">{breakfast}</span>
          </div>
        </div>
        <div className={`cancel-policy ${cancelPolicy.includes('Non-refundable') ? 'non-refundable' : ''}`}>
          {cancelPolicy}
        </div>
        {seeMore && all_room_info && (
          <div className="more-info">
            {renderDisplayFields()}

              <h3>Amenities:</h3>
              {all_room_info.amenities && all_room_info.amenities.length > 0 ? (
                all_room_info.amenities.map((value, index) => (
                  <p key={index}>{camelToText(value)}</p>
                ))
              ) : (
                <p>None</p>
              )}
            </div>


        
        )}
        <div className="room-buttons">
        <button className="see-more-button" onClick={handleSeeMoreClick}>{!seeMore && 'See More' } {seeMore && 'See Less' }</button>
        <button className="select-button" onClick={handleSelectClick}>{selectButton}</button>
            </div>
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
