import "./list.css";
import Header from "../../components/header/Header";
import Navbar from '../../components/navbar/Navbar';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import Map from "../../components/maps/Map";

const List = () => {
    const location = useLocation();
    const [destination, setDestination] = useState(location.state.destination);
    const [date, setDate] = useState(location.state.date);
    const [openDate, setOpenDate] = useState(false);
    const [options, setOptions] = useState(location.state.options);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);

    useEffect(() => {
        fetch('/destinations.json')
            .then(response => response.json())
            .then(data => {
                const dest = data.find(dest => dest.term === destination);
                if (dest) {
                    setLat(dest.lat);
                    setLng(dest.lng);
                }
            })
            .catch(error => console.error('Error fetching destinations:', error));
    }, [destination]);

    const handleDestinationChange = (event) => {
        setDestination(event.target.value);
    };
    
    const handleSearch = () => {
        // Implement your search functionality here
        console.log('Search button clicked');
    };

    const [priceListings, setPriceListings] = useState(location.state.priceListings);
    const [destinationId, setDestinationId] = useState(location.state.retrievedId);
    const [checkin, setCheckin] = useState(location.state.checkin);
    const [checkout, setCheckout] = useState(location.state.checkout);
    const [guests, setGuests] = useState(location.state.guests);
    const [hotelInformation, setHotelInformation] = useState([]);
    const [hotelPrice, setHotelPrice] = useState([]);

    useEffect(() => {
        setHotelPrice(priceListings);
        retrieveHotelInformation();
    },[])
    
    // need to implement the completed:true check, if complete:false, try again
    async function retrieveHotelInformation() {
        console.log(hotelPrice);
        console.log("RETRIEVED ID 2: " + destinationId);
        const response = await fetch(`http://localhost:3000/hotel_search/${destinationId}/${checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            }
        })
        const json = await response.json();
        setHotelInformation(json);

        console.log(hotelPrice.length);
        console.log(json.length);
    }

    return (
        <div>
            <Navbar />
            <Header type="list" />
            <div className="listContainer">
                <div className="listWrapper">
                    <div className="searchAndMapContainer">
                        <div className="mapContainer">
                            {lat && lng && <Map lat={lat} lng={lng} />}
                        </div>
                        <div className="listSearch">
                            <h1 className="listTitle">Search</h1>
                            <div className="listItem">
                                <label>Destination</label>
                                <input 
                                    value={destination}
                                    onChange={handleDestinationChange}
                                    placeholder="Enter destination"
                                    type="text" 
                                />
                            </div>
                            <div className="listItem">
                                <label>Check-in Date</label>
                                <span onClick={() => setOpenDate(!openDate)}>
                                    {`${format(date[0].startDate, "dd/MM/yyyy")} to 
                                    ${format(date[0].endDate, "dd/MM/yyyy")}`}
                                </span>
                                {openDate && (
                                    <DateRange
                                        onChange={(item)=>setDate([item.selection])}
                                        minDate={new Date()}
                                        ranges={date}
                                    />
                                )}
                            </div>
                            <div className="listItem">
                                <label>Options</label>
                                <div className="listOptions">
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Min. Price <small>per night</small>
                                        </span>
                                        <input type="number" className="listOptionInput" />
                                    </div>
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Max. Price <small>per night</small>
                                        </span>
                                        <input type="number" className="listOptionInput" />
                                    </div>
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Adult 
                                        </span>
                                        <input 
                                            type="number" 
                                            min={1} 
                                            className="listOptionInput" 
                                            placeholder={options.adult}
                                        />
                                    </div>
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Children 
                                        </span>
                                        <input 
                                            type="number" 
                                            min={0} 
                                            className="listOptionInput" 
                                            placeholder={options.children}
                                        />
                                    </div>
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Rooms 
                                        </span>
                                        <input 
                                            type="number" 
                                            min={1} 
                                            className="listOptionInput" 
                                            placeholder={options.rooms}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button>Search</button>
                        </div>
                    </div>
                    <div className="listResult">
                        {/* <SearchItem hotelName="HOTEL NAME" hotelAddress="HOTEL ADDRESS" hotelPrice="$400"/> */}
                        {hotelPrice.map(price =>
                            <SearchItem 
                                hotelId={price.id}
                                hotelInformation={hotelInformation}
                                hotelPrice={price.price}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default List;
