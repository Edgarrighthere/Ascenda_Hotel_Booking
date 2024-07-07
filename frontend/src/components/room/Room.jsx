import React from 'react';
import './room.css';

const Room = ({ roomType, imageUrl, roomOnlyPrice, breakfastPrice, cancelPolicy }) => {
    return (
        <div className="room">
            <div className="room-image">
                <img src={imageUrl} alt={`${roomType} image`} />
            </div>
            <div className="room-info">
                <h2 className="room-type">{roomType}</h2>
                <div className="room-pricing">
                    <div className="price-option">
                        <p className="room-plan">Room Only</p>
                        <p className="room-price">SGD {roomOnlyPrice}</p>
                        <p className="non-refundable">Non-refundable</p>
                    </div>
                    <div className="price-option">
                        <p className="room-plan">🍽️ Breakfast Included</p>
                        <p className="room-price">SGD {breakfastPrice}</p>
                        <p className="cancel-policy">{cancelPolicy}</p>
                    </div>
                </div>
            </div>
            <button className="select-button">Select</button>
        </div>
    );
};

const RoomList = ({ rooms }) => {
    // Display only the first room
    const room = rooms[0];
    return (
        <div className="room-list">
            <Room
                roomType={room.roomType}
                imageUrl={room.imageUrl}
                roomOnlyPrice={room.roomOnlyPrice}
                breakfastPrice={room.breakfastPrice}
                cancelPolicy={room.cancelPolicy}
            />
        </div>
    );
};

export default RoomList;
