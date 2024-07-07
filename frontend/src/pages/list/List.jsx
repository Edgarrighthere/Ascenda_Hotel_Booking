import "./list.css";
import Header from "../../components/header/Header";
import Navbar from '../../components/navbar/Navbar';
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import Map from "../../components/maps/Map";
import Autosuggest from 'react-autosuggest';
import didYouMean from 'didyoumean2';

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
                            <button onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                    <div className="listResult">
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default List;

