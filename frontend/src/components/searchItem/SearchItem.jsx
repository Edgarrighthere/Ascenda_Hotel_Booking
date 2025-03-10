import "./searchItem.css";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import placeholderImg from "../../assests/airbnb_image.jpg";

const SearchItem = ({destinationId,hotel,destination, checkin, checkout, guests}) => {

    const [textRating, setTextRating] = useState("")
    const [hotelScores, setHotelScores] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        convertRatings()
    }, [])

    function convertRatings() {
        if (hotel.rating >= 4.5) {
            setTextRating("Excellent")
        } else if (hotel.rating >= 4.0) {
            setTextRating("Very Good")
        } else if (hotel.rating >= 3.5) {
            setTextRating("Good")
        } else if (hotel.rating >= 3) {
            setTextRating("Not Bad")
        } else if (hotel.rating >= 2.5) {
            setTextRating("Average")
        } else if (hotel.rating < 2.5) {
            setTextRating("Subpar")
        }
    }

    const handleSeeAvailability = () => {
        const navigate_url = "/hotels/" + hotel.id
        navigate(navigate_url, {state: {destinationId, hotel, destination, checkin, checkout, guests, price: hotel.price, hotelName: hotel.name}})
    }
 
    return (
        <div className="searchItem">
            <div className="siSlideContainer">
                <img 
                    src={hotel.image_prefix + "1" + hotel.image_suffix} 
                    onError={(e) => {
                        e.target.src = placeholderImg;
                    }}
                    alt="" 
                    className="siImg"
                />
            </div>
            <div className="siDescription">
                <h1 className="siTitle">{hotel.name}</h1>
                <span className="siAddress">{hotel.address} <em>({hotel.distance}km from centre)</em></span>
                {/* <span className="siTaxiOp">Free Airport Transfer</span>
                <span className="siSubtitle">Suite with Air conditioning</span>
                <span className="siFeatures">1 Queen bed • 1 bathroom</span>
                <span className="siCancelOp">Free cancellation </span>
                <span className="siCancelOpSubtitle">Free cancellation within 72 hours after booking, so lock in this great price today!</span> */}
            </div>
            
            <div className="siDetails">
                <div className="siRating">
                    <span>{textRating}</span>
                    <button>{hotel.rating} / 5.0</button>
                </div>
                <div className="siDetailTexts">
                    <span className="siPrice">${hotel.price}</span>
                    <span className="siTaxOp">Includes taxes and fees</span>
                    <button className="siCheckButton" onClick={handleSeeAvailability}>See Availability</button>
                </div>
            </div>
        </div>
    )
};

export default SearchItem;