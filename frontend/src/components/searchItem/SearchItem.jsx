import "./searchItem.css";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import placeholderImg from "../../assests/airbnb_image.jpg";

const SearchItem = ({hotel}) => {

    const [textRating, setTextRating] = useState("")
    const [hotelScores, setHotelScores] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        convertRatings()
        convertScores()
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

    function convertScores() {
        var newScores = []
        for (let x of Object.keys(hotel.score)) {
            if (hotel.score[x] != null) {
                const score_category = x.charAt(0).toUpperCase() + x.slice(1);
                newScores.push({"name": score_category, "score": hotel.score[x]})
            }
        }
        setHotelScores(newScores)
    }

    const handleSeeAvailability = () => {
        const navigate_url = "/hotels/" + hotel.id
        navigate(navigate_url, {state: {hotel}})
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