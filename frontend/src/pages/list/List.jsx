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

import HotelSearch from '../../interfaces/HotelSearch';
import HotelFilter from '../../interfaces/HotelFilter';

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
    
    const [starRatings, setStarRatings] = useState([false, false, false, false, false])
    const [priceRange, setPriceRange] = useState(location.state.priceRange);
    const [newPriceRange, setNewPriceRange] = useState(location.state.priceRange);
    
    const [hotelInformation, setHotelInformation] = useState(location.state.hotelListings);
    const [originalListings, setOriginalListings] = useState(location.state.hotelListings);

    const [destinationChanged, setDestinationChanged] = useState(false);
    const [dateChanged, setDateChanged] = useState(false);
    const [optionsChanged, setOptionsChanged] = useState(false);
    const [priceRangeChanged, setPriceRangeChanged] = useState(false);
    const [ratingsChanged, setRatingsChanged] = useState(false);

    useEffect(() => {
        // Fetch destinations from JSON file via backend
        fetch(`http://localhost:5000/destination_search/`, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
          .then(response => response.json())
          .then(data => setDestinations(data));
    }, []);

    
    // Map
    useEffect(() => {
        const dest = destinations.find(dest => dest.term === destination);
        if (dest) {
            setLat(dest.lat);
            setLng(dest.lng);
        }
    }, [destination, destinations]);

    // Autocorrect
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
        setDestinationChanged(true);
    };

    const renderSuggestion = suggestion => (
        <div className="autosuggestSuggestion">
            {suggestion.term}
        </div>
    );

    // Options
    const incrementOption = (option) => {
        setOptions(prev => ({ ...prev, [option]: prev[option] + 1 }));
        setOptionsChanged(true);
    };

    const decrementOption = (option) => {
        setOptions(prev => ({ ...prev, [option]: prev[option] > 0 ? prev[option] - 1 : 0 }));
        setOptionsChanged(true);
    };

    // Ratings
    const handleStarRatingChange = (index) => {
        const selected_rating = 5-index
        var newRatings = starRatings;
        
        if (newRatings[selected_rating-1] === true) {
            newRatings[selected_rating-1] = false;
        } else {
            newRatings[selected_rating-1] = true;
        }

        setStarRatings(newRatings);
        setRatingsChanged(true);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={i <= rating ? faStarRegular : faStar}
                    className={i <= rating ? "star-icon grey" : "star-icon yellow"}
                />
            );
        }
        return stars;
    };

    // Price range
    const handlePriceRangeChange = (newRange) => {
        setNewPriceRange(newRange);
        setPriceRangeChanged(true);
    };

    // New search
    async function handleSearch() {
        if (destinationChanged || dateChanged || optionsChanged) {
            const searchResults = await HotelSearch(destination, date, options)
            const hotelListings = searchResults.listings
            const range = searchResults.range
            
            setHotelInformation(hotelListings)
            setPriceRange(range)

            setDestinationChanged(false);
            setDateChanged(false);
            setOptionsChanged(false);
            setPriceRangeChanged(false);
            setRatingsChanged(false);
        }

        if (priceRangeChanged || ratingsChanged) {
            const filterResults = await HotelFilter(originalListings, newPriceRange, priceRangeChanged, starRatings, ratingsChanged)
            setHotelInformation(filterResults)
            
            setPriceRangeChanged(false);
            setRatingsChanged(false);
        }
        console.log('Search button clicked');
    };

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
                                            onChange={(item)=> {
                                                setDate([item.selection]);
                                                setDateChanged(true);
                                                console.log("dateChanged: " + dateChanged);
                                            }}
                                            minDate={new Date()}
                                            ranges={date}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="listItem">
                                <label>Price <small>per night</small></label>
                                <RangeSlider
                                    min={priceRange[0]}
                                    max={priceRange[1]}
                                    defaultValue={priceRange}
                                    onInput={handlePriceRangeChange}
                                    className="rangeSlider"
                                />
                                <div className="priceRangeValues">
                                    <div className="priceRangeMin">
                                        <label>MIN</label>
                                        <span>SGD {newPriceRange[0]}</span>
                                    </div>
                                    <div className="priceRangeMax">
                                        <label>MAX</label>
                                        <span>SGD {newPriceRange[1]}</span>
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
                        {hotelInformation.map(hotel =>
                            <SearchItem hotel={hotel} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default List;
