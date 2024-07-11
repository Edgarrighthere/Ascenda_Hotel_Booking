import "./propertyList.css";

const PropertyList = () => {
    return (
        <div className="pList">
            <div className="pListItem">
                <img 
                    src="images/hotel_image.jpg" 
                    alt="" 
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>Hotels</h1>
                    <h2>123 hotels</h2>
                </div>
            </div>
            <div className="pListItem">
                <img 
                    src="images/airbnb_image.jpg" 
                    alt="" 
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>AirBnb</h1>
                    <h2>456 apartments</h2>
                </div>
            </div>
            <div className="pListItem">
                <img 
                    src="images/resort_image.jpg" 
                    alt="" 
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>Resorts</h1>
                    <h2>456 resorts</h2>
                </div>
            </div>
            <div className="pListItem">
                <img 
                    src="images/villa_image.jpg" 
                    alt="" 
                    className="pListImg"
                />
                <div className="pListTitles">
                    <h1>Villas</h1>
                    <h2>456 villas</h2>
                </div>
            </div>
        </div>
    );
};

export default PropertyList;