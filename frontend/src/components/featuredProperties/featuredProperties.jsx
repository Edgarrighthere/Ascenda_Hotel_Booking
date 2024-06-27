import "./featuredProperties.css";

const FeaturedProperties = () => {
    return (
        <div className="fp">
            <div className="fpItem">
                <img
                    src="images/mbs_singapore_image.jpg"
                    alt=""
                    className="fpImg"
                />
                <span className="fpName">Marina Bay Sands</span>
                <span className="fpCity">Singapore</span>
                <span className="fpPrice">Starting from $494/Night</span>
                <div className="fpRating">
                    <button>9.2 / 10</button>
                    <span>Excellent</span>
                </div>
            </div>
            <div className="fpItem">
                <img
                    src="images/fourSeasons_usa_image.jpg"
                    alt=""
                    className="fpImg"
                />
                <span className="fpName">Four Seasons</span>
                <span className="fpCity">U.S.A</span>
                <span className="fpPrice">Starting from $745/Night</span>
                <div className="fpRating">
                    <button>9.4 / 10</button>
                    <span>Excellent</span>
                </div>
            </div>
            <div className="fpItem">
                <img
                    src="images/emirates_palace_abuDhabi_image.jpg"
                    alt=""
                    className="fpImg"
                />
                <span className="fpName">Emirates Palace</span>
                <span className="fpCity">Abu Dhabi</span>
                <span className="fpPrice">Starting from $300/Night</span>
                <div className="fpRating">
                    <button>8.9 / 10</button>
                    <span>Excellent</span>
                </div>
            </div>
            <div className="fpItem">
                <img
                    src="images/aman_tokyo_image.png"
                    alt=""
                    className="fpImg"
                />
                <span className="fpName">Aman Tokyo</span>
                <span className="fpCity">Japan</span>
                <span className="fpPrice">Starting from $390/Night</span>
                <div className="fpRating">
                    <button>9.0 / 10</button>
                    <span>Excellent</span>
                </div>
            </div>
        </div>
    )
}

export default FeaturedProperties;
