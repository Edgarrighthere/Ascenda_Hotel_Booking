import React from 'react';
import './list.css';
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
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
import Pagination from '@mui/material/Pagination'; // Import the pagination CSS
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Header from '../../components/header/Header';
import Navbar from '../../components/navbar/Navbar';
import MailList from '../../components/mailList/MailList';
import Footer from '../../components/footer/Footer';
import HotelSearch from '../../controllers/HotelSearch';
import HotelFilterController from '../../controllers/HotelFilter';
import Paging from '../../controllers/Paging';
import HotelSortingController from '../../controllers/HotelSorting';
import ScrollToTop from '../../components/ScrollToTop';

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
    const [destinationPrompt, setDestinationPrompt] =useState('Where are you going?');
    const [loading, setLoading] = useState(false);
    
    const [starRatings, setStarRatings] = useState([false, false, false, false, false])
    const [priceRange, setPriceRange] = useState(location.state.priceRange);
    const [newPriceRange, setNewPriceRange] = useState(location.state.priceRange);
    
    const [hotelListings, setHotelListings] = useState(location.state.hotelListings);
    const [paginatedListings, setPaginatedListings] = useState(location.state.paginatedListings);

    const [unfilteredListings, setUnfilteredListings] = useState(location.state.originalListings);
    const [filteredListings, setFilteredListings] = useState(location.state.filteredListings);
    const [unsortedListings, setUnsortedListings] = useState(location.state.originalListings);
    const [sortedListings, setSortedListings] = useState(location.state.sortedListings);

    const [currentPage, setCurrentPage] = useState(location.state.currentPage);
    const [totalPages, setTotalPages] = useState(location.state.totalPages);

    const [originalListings, setOriginalListings] = useState(location.state.originalListings);
    const [originalPriceRange, setOriginalPriceRange] = useState(location.state.originalPriceRange);
    const [originalTotalPages, setOriginalTotalPages] = useState(location.state.originalTotalPages);

    const [destinationChanged, setDestinationChanged] = useState(false);
    const [dateChanged, setDateChanged] = useState(false);
    const [optionsChanged, setOptionsChanged] = useState(false);
    const [priceRangeChanged, setPriceRangeChanged] = useState(false);
    const [ratingsChanged, setRatingsChanged] = useState(false);

    const [sortBy, setSortBy] = useState("");

    const { destinationId, checkin, checkout, guests, page } = useParams();
    const navigate = useNavigate();

    const HotelFilter = HotelFilterController.HotelFilter;
    const HotelSorting = HotelSortingController.HotelSorting;

    useEffect(() => {
        console.log(priceRange)
    }, []);


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
        for (let i = 0; i <= 4; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={5-i}
                    icon={5-i <= rating ? faStarRegular : faStar}
                    className={5-i <= rating ? "star-icon grey" : "star-icon yellow"}
                />
            );
        }
        return stars;
    };

    // Price range
    const handlePriceRangeChange = (newRange) => {
        setNewPriceRange(newRange);
        setPriceRangeChanged(true);
        console.log("change price range")
    };

    // Sorting
    const handleSortingRequest = (event) => {
        setSortBy(event.target.value)
        if (event.target.value === 0) {
            removeSorting()
        } else if (event.target.value === 1) {
            handleSorting(true, false)
        } else if (event.target.value === 2) {
            handleSorting(false, true)
        }
    }

    async function handleSorting(sortPrice, sortRating) {
        const listings = JSON.parse(JSON.stringify(filteredListings))
        const sorted = await HotelSorting(listings, sortPrice, sortRating)
        const sortedPaginated = await Paging(sorted, 1)

        setSortedListings(sorted)
        setHotelListings(sorted)
        setPaginatedListings(sortedPaginated)
        setCurrentPage(1)

        const navigateURL = "/hotels/" + destinationId + "/" + checkin + "/" + checkout + "/" + guests + "/1" 
        navigate(navigateURL, {state: {destination, date, options, hotelListings, paginatedListings, priceRange, currentPage, totalPages, originalListings, originalPriceRange, originalTotalPages, filteredListings, sortedListings}});  
    }

    async function removeSorting() {
        const unsortedPaginated = await Paging(filteredListings, 1)
        setHotelListings(filteredListings)
        setPaginatedListings(unsortedPaginated)
        setSortedListings(unsortedListings)
        setCurrentPage(1)

        const navigateURL = "/hotels/" + destinationId + "/" + checkin + "/" + checkout + "/" + guests + "/1" 
        navigate(navigateURL, {state: {destination, date, options, hotelListings, paginatedListings, priceRange, currentPage, totalPages, originalListings, originalPriceRange, originalTotalPages, filteredListings, sortedListings}});  
    }

    // Search button clicked
    async function handleSearch() {
        // New search request
        if (destinationChanged || dateChanged || optionsChanged) {
            if(destination === ""){
                setDestinationPrompt("Please fill this up")
            }
            else{
                setLoading(true);
                const searchResults = await HotelSearch(destination, date, options)
                const newParams = searchResults.searchParameters
                const newHotelListings = searchResults.listings
                const range = searchResults.range
                const newTotalPages = searchResults.pageCount
                const newPageListings = await Paging(newHotelListings, currentPage)

                setHotelListings(newHotelListings)
                setPaginatedListings(newPageListings)
                setOriginalListings(newHotelListings)
                setFilteredListings(newHotelListings)
                setSortedListings(newHotelListings)
                setPriceRange(range)
                setNewPriceRange(range)
                setTotalPages(newTotalPages)
                setSortBy(0)

                setDestinationChanged(false);
                setDateChanged(false);
                setOptionsChanged(false);
                setPriceRangeChanged(false);
                setRatingsChanged(false);
                setLoading(false);

                const navigateURL = "/hotels/" + newParams.id + "/" + newParams.checkin + "/" + newParams.checkout + "/" + newParams.guests + "/1"
                navigate(navigateURL, {state: {destination, date, options, hotelListings, paginatedListings, priceRange, currentPage, totalPages, originalListings, originalPriceRange, originalTotalPages, filteredListings, sortedListings}});
            }
        }

        // Filtering for price & rating
        else if (priceRangeChanged || ratingsChanged) {
            
            // Check for no ratings selected
            let ratingsNotSelected = starRatings.every(val => val === false)
            if (ratingsNotSelected === true && priceRangeChanged === false) {
                // Unfilter
                const unfilteredPaginated = await Paging(sortedListings, 1)
                setHotelListings(sortedListings)
                setPaginatedListings(unfilteredPaginated)
                setFilteredListings(unfilteredListings)
                setPriceRange(originalPriceRange)
                setNewPriceRange(originalPriceRange)
                setTotalPages(originalTotalPages)

            } else {
                // Filter
                const filterResults = await HotelFilter(sortedListings, newPriceRange, priceRangeChanged, starRatings, ratingsChanged)
                const filteredHotels = filterResults.hotels
                const filteredPages = filterResults.pages
                const filteredPriceRange = filterResults.range
                const filteredPagedResults = await Paging(filteredHotels, 1)

                setFilteredListings(filteredHotels)
                setHotelListings(filteredHotels)
                setPaginatedListings(filteredPagedResults)
                setNewPriceRange(filteredPriceRange)
                setTotalPages(filteredPages)
            }

            setCurrentPage(1)

            setPriceRangeChanged(false);
            setRatingsChanged(false);

            const navigateURL = "/hotels/" + destinationId + "/" + checkin + "/" + checkout + "/" + guests + "/1"
            navigate(navigateURL, {state: {destination, date, options, hotelListings, paginatedListings, priceRange, currentPage, totalPages, originalListings, originalPriceRange, originalTotalPages, filteredListings, sortedListings}});
        }
        console.log('Search button clicked');
    }

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
        handleNewPage(newPage);
    };
    
    async function handleNewPage(page) {
        const newPagedListings = await Paging(hotelListings, page);
        const navigateURL = "/hotels/" + destinationId + "/" + checkin + "/" + checkout + "/" + guests + "/" + page;
        const state = 
        navigate(navigateURL, {state: {destination, date, options, hotelListings, paginatedListings, priceRange, currentPage, totalPages, originalListings, originalPriceRange, originalTotalPages}});
        console.log()
        setPaginatedListings(newPagedListings);
    }

    return (
        <div>
            <Navbar />
            <Header type="list" />
            <div className="mainContainer">
                <div className="listContainer">
                    <div className="listWrapper">
                        <div className="searchAndMapContiner">
                            <div data-testid="maps" data-test="maps" className="mapContainer">
                                {lat && lng && <Map lat={lat} lng={lng} />}
                            </div>
                            <div data-testid="filterPanel" data-test="filterPanel" className="listSearch">
                                <h1 data-test="listTitle" className="listTitle">Search</h1>
                                <div data-test="listItem1" className="listItem">
                                    <label>Destination</label>
                                    <Autosuggest
                                        suggestions={suggestions}
                                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                                        getSuggestionValue={suggestion => suggestion.term}
                                        renderSuggestion={renderSuggestion}
                                        inputProps={{
                                            placeholder: destinationPrompt,
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
                                <div data-test="listItem2" className="listItem">
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
                                                }}
                                                minDate={new Date()}
                                                ranges={date}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div data-test="listItem3" className="listItem">
                                    <label>Guest Information</label>
                                    <div className="listOptions">
                                        <div className="listOptionItem">
                                            <span className="listOptionText">
                                                Adults 
                                            </span>
                                            <div className="optionCounter">
                                                <button data-test="adultsDecrease" disabled={options.adult <= 1} onClick={() => decrementOption('adult')} className="optionCounterButton">-</button>
                                                <span data-test="adultsNum" className="optionCounterNumber">{options.adult}</span>
                                                <button data-test="adultsIncrease" onClick={() => incrementOption('adult')} className="optionCounterButton">+</button>
                                            </div>
                                        </div>
                                        <div className="listOptionItem">
                                            <span className="listOptionText">
                                                Children 
                                            </span>
                                            <div className="optionCounter">
                                                <button data-test="childrenDecrease" disabled={options.children <= 0} onClick={() => decrementOption('children')} className="optionCounterButton">-</button>
                                                <span data-test="childrenNum" className="optionCounterNumber">{options.children}</span>
                                                <button data-test="childrenIncrease" onClick={() => incrementOption('children')} className="optionCounterButton">+</button>
                                            </div>
                                        </div>
                                        <div className="listOptionItem">
                                            <span className="listOptionText">
                                                Rooms 
                                            </span>
                                            <div className="optionCounter">
                                                <button data-test="roomsDecrease" disabled={options.rooms <= 1} onClick={() => decrementOption('rooms')} className="optionCounterButton">-</button>
                                                <span data-test="roomsNum" className="optionCounterNumber">{options.rooms}</span>
                                                <button data-test="roomsIncrease" onClick={() => incrementOption('rooms')} className="optionCounterButton">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div data-test="listItem4" className="listItem">
                                    <label>Price per night</label>
                                    <RangeSlider
                                        min={priceRange[0]}
                                        max={priceRange[1]}
                                        step={10}
                                        value={newPriceRange}
                                        onInput={handlePriceRangeChange}
                                        className="rangeSlider"
                                        data-test="priceRangeSlider"
                                    />
                                    <div className="priceRangeValues">
                                        <div className="priceRangeMin">
                                            <label>MIN</label>
                                            <span>S${newPriceRange[0]}</span>
                                        </div>
                                        <div className="priceRangeMax">
                                            <label>MAX</label>
                                            <span>S${newPriceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>
                                <div data-test="listItem5" className="listItem">
                                    <label>Hotel Rating</label>
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
                                {loading && <button className="listSearchButton">Loading...</button>}
                                {!loading && <button data-test="filterPanelSearch" className="listSearchButton" onClick={handleSearch}>Search</button>}
                            </div>
                        </div>
                        <div className="resultContainer">
                            <span>{hotelListings.length} hotels found</span>
                            <div className="sortContainer">
                                <FormControl className="sortButton">
                                    <InputLabel>Sort by:</InputLabel>
                                    <Select
                                        label="Sort by:"
                                        value={sortBy}
                                        onChange={handleSortingRequest}
                                    >
                                        <MenuItem value={0}>---</MenuItem>
                                        <MenuItem value={1}>Price (lowest first)</MenuItem>
                                        <MenuItem value={2}>Rating (highest first)</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="listResult">
                                {paginatedListings.map(hotel =>
                                    <SearchItem 
                                    destinationId = {destinationId}
                                    hotel={hotel} 
                                    destination={destination}
                                    checkin={checkin}
                                    checkout={checkout}
                                    guests={guests}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="paginationBar">
                    <Pagination 
                        count = {totalPages}
                        shape="rounded"
                        page = {currentPage}
                        onChange = {handlePageChange}
                    />
                </div>
                <MailList />
                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default List;
