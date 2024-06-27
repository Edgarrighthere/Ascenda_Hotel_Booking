import "./searchItem.css";

const SearchItem = () => {
    return (
        <div className="searchItem">
            <img 
                src="images/aman_tokyo_image.png" 
                alt="" 
                className="siImg"
            />
            <div className="siDescription">
                <h1 className="siTitle">Hotel A</h1>
                <span className="siDistance">XXXm from center</span>
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
                    <span className="siPrice">$112</span>
                    <span className="siTaxOp">Includes taxes and fees</span>
                    <button className="siCheckButton">See Availability</button>
                </div>
            </div>
        </div>
    );
};

export default SearchItem;