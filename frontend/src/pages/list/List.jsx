import React from 'react';
import './list.css';
import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import SearchItem from '../../components/searchItem/SearchItem';
import Map from '../../components/maps/Map';
import Autosuggest from 'react-autosuggest';
import didYouMean from 'didyoumean2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css'; // Import the slider CSS

const List = () => {
    const location = useLocation();
    const [destination, setDestination] = useState(location.state.destination);
    const [date, setDate] = useState(location.state.date);
    const [openDate, setOpenDate] = useState(false);
    const [options, setOptions] = useState(location.state.options);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [starRatings, setStarRatings] = useState({
        5: false,
        4: false,
        3: false,
        2: false,
        1: false
    });
    const [priceRange, setPriceRange] = useState([0, 2500]); // State for price range

    useEffect(() => {
        fetch('/destinations.json')
            .then(response => response.json())
            .then(data => setDestinations(data));
    }, []);

    useEffect(() => {
        const dest = destinations.find(dest => dest.term === destination);
        if (dest) {
            setLat(dest.lat);
            setLng(dest.lng);
        }
    }, [destination, destinations]);

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        if (inputLength === 0) {
            return [];
        }

        const terms = destinations.map(dest => dest.term);
        const suggestions = didYouMean(inputValue, terms, { returnType: 'all-sorted-matches' });

        return suggestions
            .map(suggestion => destinations.find(dest => dest.term && dest.term.toLowerCase() === suggestion.toLowerCase()))
            .filter(Boolean);
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

    const handleSearch = () => {
        // Implement your search functionality here
        console.log('Search button clicked');
    };

    const incrementOption = (option) => {
        setOptions(prev => ({ ...prev, [option]: prev[option] + 1 }));
    };

    const decrementOption = (option) => {
        setOptions(prev => ({ ...prev, [option]: prev[option] > 0 ? prev[option] - 1 : 0 }));
    };

    const handleStarRatingChange = (star) => {
        setStarRatings(prev => ({ ...prev, [star]: !prev[star] }));
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 5; i >= 1; i--) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={i <= rating ? faStar : faStarRegular}
                    className={i <= rating ? "star-icon yellow" : "star-icon grey"}
                />
            );
        }
        return stars;
    };

    const handlePriceRangeChange = (newRange) => {
        setPriceRange(newRange);
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
                                <Autosuggest
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                                    getSuggestionValue={suggestion => suggestion.term}
                                    renderSuggestion={renderSuggestion}
                                    inputProps={{
                                        placeholder: 'Enter destination',
                                        value: destination,
                                        onChange: onChange,
                                        className: "listSearchInput"
                                    }}
                                    theme={{
                                        suggestionsContainer: "autosuggestSuggestionsContainer",
                                        suggestionsList: "autosuggestSuggestions",
                                        suggestion: "autosuggestSuggestion",
                                        suggestionHighlighted: "autosuggestSuggestion--highlighted",
                                        container: "autosuggestContainer"
                                    }}
                                />
                            </div>
                            <div className="listItem">
                                <label>Check-in Date</label>
                                <span className="listDatepicker" onClick={() => setOpenDate(!openDate)}>
                                    {`${format(date[0].startDate, "dd/MM/yyyy")} to 
                                    ${format(date[0].endDate, "dd/MM/yyyy")}`}
                                </span>
                                {openDate && (
                                    <div className="datePickerOverlay">
                                        <DateRange
                                            onChange={(item)=>setDate([item.selection])}
                                            minDate={new Date()}
                                            ranges={date}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="listItem">
                                <label>Price <small>per night</small></label>
                                <RangeSlider
                                    min={0}
                                    max={2500}
                                    defaultValue={priceRange}
                                    onInput={handlePriceRangeChange}
                                    className="rangeSlider"
                                />
                                <div className="priceRangeValues">
                                    <div className="priceRangeMin">
                                        <label>MIN</label>
                                        <span>SGD {priceRange[0]}</span>
                                    </div>
                                    <div className="priceRangeMax">
                                        <label>MAX</label>
                                        <span>SGD {priceRange[1]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="listItem">
                                <label>Options</label>
                                <div className="listOptions">
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Adult 
                                        </span>
                                        <div className="optionCounter">
                                            <button disabled={options.adult <= 1} onClick={() => decrementOption('adult')} className="optionCounterButton">-</button>
                                            <span className="optionCounterNumber">{options.adult}</span>
                                            <button onClick={() => incrementOption('adult')} className="optionCounterButton">+</button>
                                        </div>
                                    </div>
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Children 
                                        </span>
                                        <div className="optionCounter">
                                            <button disabled={options.children <= 0} onClick={() => decrementOption('children')} className="optionCounterButton">-</button>
                                            <span className="optionCounterNumber">{options.children}</span>
                                            <button onClick={() => incrementOption('children')} className="optionCounterButton">+</button>
                                        </div>
                                    </div>
                                    <div className="listOptionItem">
                                        <span className="listOptionText">
                                            Rooms 
                                        </span>
                                        <div className="optionCounter">
                                            <button disabled={options.rooms <= 1} onClick={() => decrementOption('rooms')} className="optionCounterButton">-</button>
                                            <span className="optionCounterNumber">{options.rooms}</span>
                                            <button onClick={() => incrementOption('rooms')} className="optionCounterButton">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="listItem">
                                <label>Hotel Star Rating</label>
                                <div className="listStarRatings">
                                    {Object.keys(starRatings).map(star => (
                                        <div key={star} className="listStarRatingItem">
                                            <input
                                                type="checkbox"
                                                id={`star-${star}`}
                                                checked={starRatings[star]}
                                                onChange={() => handleStarRatingChange(star)}
                                            />
                                            <label htmlFor={`star-${star}`}>
                                                {renderStars(star)}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="listSearchButton" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                    <div className="listResult">
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
