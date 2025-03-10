import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faHotel,
  faBed,
  faPlaneDeparture,
  faCar,
  faPerson,
} from "@fortawesome/free-solid-svg-icons";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState, useEffect, useRef } from "react";
import Autosuggest from "react-autosuggest";
import didYouMean from "didyoumean2";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import HotelSearch from "../../controllers/HotelSearch.js";
import Paging from "../../controllers/Paging.js";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
// import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ type }) => {
  const [show, setShow] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [destination, setDestination] = useState(""); // what you enter into search bar
  const [openDate, setOpenDate] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [destinations, setDestinations] = useState([]); // for the suggestions
  const [loading, setLoading] = useState(false);
  const [destinationPrompt, setDestinationPrompt] = useState(
    "Where are you going?"
  );

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    rooms: 1,
  });

  const navigate = useNavigate(); // use to redirect between pages
  const dateRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    // Fetch destinations from JSON file via backend
    fetch(`http://localhost:5000/destination_search/`, {
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => setDestinations(data));
  }, []);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  async function handleSearch() {
    if (destination === "") {
      setAlertText(
        "Destination not found: Please fill up the options below 😊"
      );
      setShow(true);
      setDestinationPrompt("Please fill this up");
    } else {
      setLoading(true);
      const searchResults = await HotelSearch(destination, date, options);
      const success = searchResults.success;
      console.log(success);

      if (success == true) { // there are listings found, move on to view list of hotels
        const params = searchResults.searchParameters;
        const hotelListings = searchResults.listings;
        const paginatedListings = await Paging(hotelListings, 1);
        const priceRange = searchResults.range;
        const currentPage = 1;
        const totalPages = searchResults.pageCount;
        const originalListings = hotelListings;
        const originalPriceRange = priceRange;
        const originalTotalPages = totalPages;
        const filteredListings = hotelListings;
        const sortedListings = hotelListings;

        const navigateURL =
          "/hotels/" +
          params.id +
          "/" +
          params.checkin +
          "/" +
          params.checkout +
          "/" +
          params.guests +
          "/1";

        let checkinDate = new Date(params.checkin);
        let checkoutDate = new Date(params.checkout);
        const time_diff = checkoutDate.getTime() - checkinDate.getTime();
        const differenceInDays = Math.round(time_diff / (1000 * 3600 * 24));

        const searchDetails = {
          checkin: params.checkin,
          checkout: params.checkout,
          adults: options.adult,
          children: options.children,
          rooms: options.rooms,
          days: differenceInDays,
        };

        localStorage.setItem("search_details", JSON.stringify(searchDetails));

        navigate(navigateURL, {
          state: {
            destination,
            date,
            options,
            hotelListings,
            paginatedListings,
            priceRange,
            currentPage,
            totalPages,
            originalListings,
            originalPriceRange,
            originalTotalPages,
            filteredListings,
            sortedListings,
          },
        });
      } else { // there are no listings found
        setAlertText("No listings found.");
        setShow(true);
        setLoading(false);
      }
    }
  }

  // Autocorrect
  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];
    }

    // Get the terms from the destinations and apply didYouMean2
    const terms = destinations.map((dest) => dest.term);
    const suggestions = didYouMean(inputValue, terms, {
      returnType: "all-sorted-matches",
    });

    return suggestions
      .map((suggestion) =>
        destinations.find(
          (dest) =>
            dest.term && dest.term.toLowerCase() === suggestion.toLowerCase()
        )
      )
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

  const renderSuggestion = (suggestion) => (
    <div className="autosuggestSuggestion">{suggestion.term}</div>
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setOpenDate(false);
      }
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dateRef, optionsRef]);

  return (
    <div className="header">
      <div
        className={
          type === "list" ? "headerContainer listMode" : "headerContainer"
        }
      >
        <div className="headerList">
          <div data-test="hotelsOption" className="headerListItem active">
            <FontAwesomeIcon icon={faHotel} />
            <span>Hotels</span>
          </div>
          <div data-test="flightsOption" className="headerListItem">
            <FontAwesomeIcon icon={faPlaneDeparture} />
            <span>Flights</span>
          </div>
          <div data-test="CarsOption" className="headerListItem">
            <FontAwesomeIcon icon={faCar} />
            <span>Cars</span>
          </div>
        </div>
        {type !== "list" && (
          <>
            <h1 data-test="headerTitletext" className="headerTitle">
              Experience the world your way <br />
              with Travel with Ascenda.
            </h1>
            <p data-test="headerDesctext" className="headerDescription">
              Enjoy exclusive travel deals using Ascenda.
            </p>
            <button
              data-test="headerLogin"
              className="headerBtn"
              onClick={handleLogin}
            >
              Log in
            </button>
            {loading && (
              <div className="headerSearch">
                <img src="./images/loading.gif" alt="Loading Status" />
              </div>
            )}
            {!loading && (
              <div className="headerSearch" data-testid="headerSearchBar">
                <div
                  data-testid="destinationSearchInput"
                  data-test="destinationSearch"
                  className="headerSearchItem"
                >
                  <FontAwesomeIcon icon={faBed} className="headerIcon" />
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={onSuggestionsClearRequested}
                    getSuggestionValue={(suggestion) => suggestion.term}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                      placeholder: destinationPrompt,
                      value: destination,
                      onChange: onChange,
                      className: "headerSearchInput",
                    }}
                    className="headerSearchInput"
                    theme={{
                      suggestionsContainer: "autosuggestSuggestionsContainer",
                      suggestionsList: "autosuggestSuggestions",
                      suggestion: "autosuggestSuggestion",
                      suggestionHighlighted:
                        "autosuggestSuggestion--highlighted",
                      container: "autosuggestContainer",
                    }}
                  />
                </div>
                <div
                  data-testid="dateSearchInput"
                  data-test="dateSearch"
                  className="headerSearchItem"
                >
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="headerIcon"
                  />
                  <span
                    onClick={() => setOpenDate(!openDate)}
                    className="headerSearchText"
                    data-testid="datePickerDropdown"
                  >
                    {`${format(date[0].startDate, "dd/MM/yyyy")} to ${format(
                      date[0].endDate,
                      "dd/MM/yyyy"
                    )}`}
                  </span>
                  {openDate && (
                    <div ref={dateRef}>
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                        className="date"
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>
                <div
                  data-testid="guestInfoSearch"
                  data-test="guestInfoSearch"
                  className="headerSearchItem"
                >
                  <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                  <span
                    onClick={() => setOpenOptions(!openOptions)}
                    className="headerSearchText"
                    data-testid="guestInfoDropdown"
                  >
                    {`${options.adult} adult · 
                                ${options.children} children · 
                                ${options.rooms} rooms`}
                  </span>
                  {openOptions && (
                    <div ref={optionsRef} className="options">
                      <div className="optionItem">
                        <span className="optionText">Adult</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.adult <= 1}
                            data-test="adultsDecrease"
                            data-testid="decreaseAdult"
                            className="optionCounterButton"
                            onClick={() => handleOption("adult", "d")}
                          >
                            -
                          </button>
                          <span
                            data-test="adultsNum"
                            data-testid="adultCount"
                            className="optionCounterNumber"
                          >
                            {options.adult}
                          </span>
                          <button
                            data-test="adultsIncrease"
                            data-testid="increaseAdult"
                            className="optionCounterButton"
                            onClick={() => handleOption("adult", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="optionItem">
                        <span className="optionText">Children</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.children <= 0}
                            data-test="childrenDecrease"
                            className="optionCounterButton"
                            onClick={() => handleOption("children", "d")}
                          >
                            -
                          </button>
                          <span
                            data-test="childrenNum"
                            className="optionCounterNumber"
                          >
                            {options.children}
                          </span>
                          <button
                            data-test="childrenIncrease"
                            className="optionCounterButton"
                            onClick={() => handleOption("children", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="optionItem">
                        <span className="optionText">Rooms</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.rooms <= 1}
                            data-test="roomsDecrease"
                            className="optionCounterButton"
                            onClick={() => handleOption("rooms", "d")}
                          >
                            -
                          </button>
                          <span
                            data-test="roomsNum"
                            className="optionCounterNumber"
                          >
                            {options.rooms}
                          </span>
                          <button
                            data-test="roomsIncrease"
                            className="optionCounterButton"
                            onClick={() => handleOption("rooms", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="headerSearchItem">
                  <button
                    data-testid="searchTest"
                    data-test="searchTest"
                    className="headerBtn"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
            {show && (
              <Alert show={show}>
                <p className="alertHeading">{alertText}</p>
                <div className="alertButton">
                  <Button onClick={() => setShow(false)}>Close</Button>
                </div>
              </Alert>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
