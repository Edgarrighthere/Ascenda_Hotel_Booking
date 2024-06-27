import "./featured.css";

const Featured = () => {
    return (
        <div className="featured">
            <div className="featuredItem">
                <img 
                    src="images/seoul_image.jpg" 
                    alt="" 
                    className="featuredImg"
                />
                <div className="featuredTitles">
                    <h1>Seoul</h1>
                    <h2>123 Listings</h2>
                </div>
            </div>

            <div className="featuredItem">
                <img 
                    src="images/berlin_image.jpg" 
                    alt="" 
                    className="featuredImg"
                />
                <div className="featuredTitles">
                    <h1>Berlin</h1> 
                    <h2>456 Listings</h2>
                </div>
            </div>
            
            <div className="featuredItem">
                <img 
                    src="images/london_image.jpg" 
                    alt="" 
                    className="featuredImg"/>
                <div className="featuredTitles">
                    <h1>London</h1>
                    <h2>789 Listings</h2>
                </div>
            </div>
        </div>
    );
};

export default Featured;