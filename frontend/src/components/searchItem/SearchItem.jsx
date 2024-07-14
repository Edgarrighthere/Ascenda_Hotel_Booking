import "./searchItem.css";
import placeholderImg from "../../assests/airbnb_image.jpg";

const SearchItem = ({hotel}) => {
 
    return (
        <div className="searchItem">
            <img 
                src={hotel.main_image_url} 
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
                    <button>{hotel.rating}, {hotel.starRating} stars</button>
                </div>
                <div className="siDetailTexts">
                    <span className="siPrice">${hotel.price}</span>
                    <span className="siTaxOp">Includes taxes and fees</span>
                    <button className="siCheckButton">See Availability</button>
                </div>
            </div>
        </div>
    )
};

export default SearchItem;