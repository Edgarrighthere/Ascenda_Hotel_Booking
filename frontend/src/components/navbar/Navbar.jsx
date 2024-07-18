import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentSalutation, setCurrentSalutation] = useState(localStorage.getItem('salutation') || "Guest");
    const [currentFirstName, setCurrentFirstName] = useState(localStorage.getItem('firstName') || "");
    const [currentLastName, setCurrentLastName] = useState(localStorage.getItem('lastName') || "");

    const dropdownRef = useRef(null); // Ref to handle dropdown close delay

    useEffect(() => {
        if (location.state && location.state.salutation) {
            setCurrentSalutation(location.state.salutation);
            localStorage.setItem('salutation', location.state.salutation);
        }
    }, [location.state]);

    useEffect(() => { 
        if (location.state && location.state.firstName) {
            setCurrentFirstName(location.state.firstName);
            localStorage.setItem('firstName', location.state.firstName);
        }
    }, [location.state]);

    useEffect(() => { 
        if (location.state && location.state.lastName) {
            setCurrentLastName(location.state.lastName);
            localStorage.setItem('lastName', location.state.lastName);
        }
    }, [location.state]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            // Close dropdown if clicked outside of it
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleRegister = () => {
        navigate("/register");
    };

    const handleLogoClick = () => {
        if (location.pathname !== "/" && location.pathname !== "/inputOTP") {
            navigate("/");
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleOptionClick = (path) => {
        setDropdownOpen(false);
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5001/logout");
            setCurrentSalutation("Guest");
            setCurrentFirstName("");
            setCurrentLastName("");
            localStorage.removeItem('salutation');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            setDropdownOpen(false);
            navigate("/");
            alert("Logout successful");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div className="navbar">
            <div className="navContainer">
                <img
                    src="/images/logo_ascenda.png"
                    className="logo"
                    onClick={handleLogoClick}
                    alt="Ascenda Logo"
                />
                <div className="navItems">
                    <button className="navButton" onClick={handleRegister}>
                        Register
                    </button>
                    <div className="dropdown" ref={dropdownRef}>
                        <button className="dropdownButton" onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faUser} /> Welcome, {currentSalutation} {currentFirstName} {currentLastName}!
                            <FontAwesomeIcon icon={faBars} className="menuIcon" />
                        </button>
                        <div className={`dropdownContent ${dropdownOpen ? 'show' : 'hide'}`}>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/login")}>
                                Log in
                            </div>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/account")}>
                                Account info.
                            </div>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/bookings")}>
                                Bookings
                            </div>
                            <div className="dropdownItem" onClick={handleLogout}>
                                Log out
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
