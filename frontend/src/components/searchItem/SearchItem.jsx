import "./searchItem.css";
import { useState, useEffect } from "react";

const SearchItem = ({hotelId, hotelInformation, hotelPrice}) => {
 
    return (
        hotelInformation.map(hotel => hotel.id === hotelId &&
            <div className="searchItem">
                <img 
                    src="images/aman_tokyo_image.png" 
                    alt="" 
                    className="siImg"
                />
                <div className="siDescription">
                    <h1 className="siTitle">{hotel.name} ({hotelId})</h1>
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
                        {/* {hotelPriceSet.map(priceInfo =>
                            <span className="siPrice">
                                {console.log("HOTEL ID: " + hotelId)}
                                {console.log(priceInfo.id, priceInfo.id == hotelId)}
                                {priceInfo.id == hotelId ? console.log(priceInfo.price) : null}
                            </span>)} */}
                        <span className="siPrice">${hotelPrice} ({hotelId})</span>
                        <span className="siTaxOp">Includes taxes and fees</span>
                        <button className="siCheckButton">See Availability</button>
                    </div>
                </div>
            </div>
        )
    );
};

export default SearchItem;