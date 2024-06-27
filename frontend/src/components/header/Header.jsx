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
import { useState } from "react";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Header =({ type }) => {
    const [destination, setDestination] = useState("");
    const [openDate, setOpenDate] = useState(false);
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

    const navigate = useNavigate(); //use to redirect between pages

    const handleOption = (name, operation) => {
        setOptions((prev) => {
            return {
               ...prev, 
               [name]: operation === "i" ? options[name] + 1 : options[name] -1
            };
        });
    };

    const handleSearch = () => {
        navigate("/hotels", {state: {destination, date, options}});
    };

    const handleLogin = () => {
        navigate("/login");
    };

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
                        Experience the world your way with Travel with Ascenda.
                    </h1>
                    <p className="headerDescription">
                        Enjoy exclusive travel deals using Ascenda.
                    </p>
                    <button className="headerBtn" onClick={handleLogin}>Log in</button>
                    <div className="headerSearch">
                        <div className="headerSearchItem">
                            <FontAwesomeIcon icon={faBed} className="headerIcon" />
                            <input 
                                type="text"
                                placeholder="Where are you going?"
                                className="headerSearchInput" 
                                onChange={e=>setDestination(e.target.value)}
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
                            <button className="headerBtn" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    )
};

export default Header;