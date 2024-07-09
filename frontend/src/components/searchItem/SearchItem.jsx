import "./searchItem.css";
import { useState, useEffect } from "react";

const SearchItem = ({hotelId, hotelInformation, hotelPrice}) => {
    const placeholderImg = "images/airbnb_image.jpg"
 
    return (
        hotelInformation.map(hotel => hotel.id === hotelId &&
            <div className="searchItem">
                <img 
                    src={hotel.image_details.prefix + "1" + hotel.image_details.suffix} 
                    onError={(e) => {
                        e.target.src = placeholderImg;
                    }}
                    alt="" 
                    className="siImg"
                />
                <div className="siDescription">
                    <h1 className="siTitle">{hotel.name}</h1>
                    <span className="siDistance">{hotel.address}</span>
                    <span className="siTaxiOp">Free Airport Transfer</span>
                    <span className="siSubtitle">Suite with Air conditioning</span>
                    <span className="siFeatures">1 Queen bed • 1 bathroom</span>
                    <span className="siCancelOp">Free cancellation </span>
                    <span className="siCancelOpSubtitle">Free cancellation within 72 hours after booking, so lock in this great price today!</span>
                </div>
                <div className="siDetails">
                    <div className="siRating">
                        <span>Excellent</span>
                        <button>8.9 / 10</button>
                    </div>
                    <div className="siDetailTexts">
                        <span className="siPrice">${hotelPrice}</span>
                        <span className="siTaxOp">Includes taxes and fees</span>
                        <button className="siCheckButton">See Availability</button>
                    </div>
                </div>
            </div>
        )
    )
};

export default SearchItem;