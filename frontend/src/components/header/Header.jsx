import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCalendarDays, 
    faHotel, 
    faBed, 
    faPlaneDeparture, 
    faCar, 
    faPerson 
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState, useEffect } from "react";
import Autosuggest from 'react-autosuggest';
import didYouMean from 'didyoumean2';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Header =({ type }) => {
    const [destination, setDestination] = useState(""); // what you enter into search bar
    const [openDate, setOpenDate] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [destinations, setDestinations] = useState([]); // for the suggestions

    const [destinationId, setDestinationId] = useState("");

    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(), 
            key: 'selection'
        }
    ]);

    const [openOptions, setOpenOptions] = useState(false);
    const [options, setOptions] = useState({
        adult:1,
        children:0,
        rooms:1
    });

    const [checkin, setCheckin] = useState([]);
    const [checkout, setCheckout] = useState([]);
    const [guests, setGuests] = useState([]);

    const navigate = useNavigate(); //use to redirect between pages

    useEffect(() => {
        // Fetch destinations from JSON file
        fetch("/destinations.json")
          .then(response => response.json())
          .then(data => setDestinations(data));
    }, []);

    useEffect(() => {
        setCheckin(format(date[0].startDate,"yyyy-MM-dd"));
        setCheckout(format(date[0].endDate, "yyyy-MM-dd"));
        setGuests(countGuestsAndRooms());
    })


    // Get destination ID
    async function getId() {
        console.log("destination: " + destination + ", checkin: " + checkin + ", checkout: " + checkout + ", guests: " + guests);
        var retrievedId;
        for (let getDestination of destinations) {
            if (destination.includes(getDestination.term)) {
                retrievedId = getDestination.uid;
                console.log(retrievedId);
                setDestinationId(retrievedId);
                retrieveHotelListings(retrievedId);
                break
            }
        }
    }

    // need to implement the completed:true check, if complete:false, try again
    async function retrieveHotelListings(retrievedId) {
        //console.log("Going to fetch from backend server with id: " + retrievedId);
        const response = await fetch(`http://localhost:5000/hotel_price/${retrievedId}/${checkin}/${checkout}/${guests}`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded",
            }
        })
        const price_listings_json = await response.json();
        console.log(price_listings_json);
        console.log("pric length: " + price_listings_json.length);
        handleSearch(price_listings_json, retrievedId);
    }

    function countGuestsAndRooms() {
        var guest_count = options.adult + options.children;
        console.log("GUEST COUNT: " + guest_count);
        var room_count = options.rooms;
        console.log("ROOM COUNT: " + room_count);
        var guest_input = `${guest_count}`
        if (room_count > 1) {
            guest_input += `|${guest_count}` 
        }
        console.log(guest_input);
        return guest_input;
    }

    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
               ...prev, 
               [name]: operation === "i" ? options[name] + 1 : options[name] -1
            };
        });
    };

    const handleSearch = (priceListings, retrievedId) => {
        console.log("RETRIEVED ID: " + retrievedId);
        navigate("/hotels", {state: {destination, date, options, priceListings, retrievedId, checkin, checkout, guests}});
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
    
        if (inputLength === 0) {
            return [];
        }
    
        // Get the terms from the destinations and apply didYouMean2
        const terms = destinations.map(dest => dest.term);
        const suggestions = didYouMean(inputValue, terms, { 
            returnType: 'all-sorted-matches' 
        });

        return suggestions
        .map(suggestion => destinations.find(dest => dest.term && dest.term.toLowerCase() === suggestion.toLowerCase()))
        .filter(Boolean); // Filter out any undefined results
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onChange = (event, { newValue }) => {
        setDestination(newValue);
    };

    const renderSuggestion = suggestion => (
        <div className="autosuggestSuggestion">
            {suggestion.term}
        </div>
    );

    return (
        <div className="header">
            <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
                <div className="headerList">
                    <div className="headerListItem active">
                        <FontAwesomeIcon icon={faHotel} />
                        <span>Hotels</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faPlaneDeparture} />
                        <span>Flights</span>
                    </div>
                    <div className="headerListItem">
                        <FontAwesomeIcon icon={faCar} />
                        <span>Cars</span>
                    </div>
                </div>
                { type !== "list" &&
                    <>
                    <h1 className="headerTitle">
                        Experience the world your way <br/>with Travel with Ascenda.
                    </h1>
                    <p className="headerDescription">
                        Enjoy exclusive travel deals using Ascenda.
                    </p>
                    <button className="headerBtn" onClick={handleLogin}>Log in</button>
                    <div className="headerSearch">
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faBed} className="headerIcon" />
                            <Autosuggest
                                suggestions={suggestions}
                                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                onSuggestionsClearRequested={onSuggestionsClearRequested}
                                getSuggestionValue={suggestion => suggestion.term}
                                renderSuggestion={renderSuggestion}
                                inputProps={{
                                    placeholder: 'Where are you going?',
                                    value: destination,
                                    onChange: onChange,
                                    className: "headerSearchInput"
                                }}
                                className="headerSearchInput"
                                theme={{
                                    suggestionsContainer: "autosuggestSuggestionsContainer",
                                    suggestionsList: "autosuggestSuggestions",
                                    suggestion: "autosuggestSuggestion",
                                    suggestionHighlighted: "autosuggestSuggestion--highlighted",
                                    container: "autosuggestContainer"
                                }}
                            />
                        </div>
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                            <span onClick={()=>setOpenDate(!openDate)} className="headerSearchText">
                                {`${format(
                                date[0].startDate,
                                "dd/MM/yyyy"
                                )} to ${format(date[0].endDate, 
                                "dd/MM/yyyy"
                                )}`}
                            </span>
                            {openDate && (
                                <DateRange 
                                    editableDateInputs={true}
                                    onChange={(item) => setDate([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={date}
                                    className="date"
                                    minDate={new Date()}
                                />
                            )}
                        </div>
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                            <span onClick={()=>setOpenOptions(!openOptions)} className="headerSearchText">
                                {`${options.adult} adult · 
                                ${options.children} children · 
                                ${options.rooms} rooms`}</span>
                                {openOptions && <div className="options">
                                    <div className="optionItem">
                                        <span className="optionText">Adult</span>
                                        <div className="optionCounter">
                                            <button 
                                                disabled={options.adult <= 1}
                                                className="optionCounterButton" onClick={()=>handleOption("adult", "d")}>-</button>
                                            <span className="optionCounterNumber">{options.adult}</span>
                                            <button className="optionCounterButton" onClick={()=>handleOption("adult", "i")}>+</button>
                                        </div>
                                    </div>
                                    <div className="optionItem">
                                        <span className="optionText">Children</span>
                                        <div className="optionCounter">
                                            <button 
                                                disabled={options.children <= 0}
                                                className="optionCounterButton" onClick={()=>handleOption("children", "d")}>-</button>
                                            <span className="optionCounterNumber">{options.children}</span>
                                            <button className="optionCounterButton" onClick={()=>handleOption("children", "i")}>+</button>
                                        </div>
                                    </div>
                                    <div className="optionItem">
                                        <span className="optionText">Rooms</span>
                                        <div className="optionCounter">
                                            <button 
                                                disabled={options.rooms <= 1}
                                                className="optionCounterButton" onClick={()=>handleOption("rooms", "d")}>-</button>
                                            <span className="optionCounterNumber">{options.rooms}</span>
                                            <button className="optionCounterButton" onClick={()=>handleOption("rooms", "i")}>+</button>
                                        </div>
                                    </div>
                                </div>}
                        </div>
                        <div className="headerSearchItem">
                            <button className="headerBtn" onClick={getId}>Search</button>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    )
};

export default Header;