import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, useContext} from "react";
import axios from "axios";
import React from "react"; 


const Navbar = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentSalutation, setCurrentSalutation] = useState(localStorage.getItem('salutation') || "Guest");
    const [currentFirstName, setCurrentFirstName] = useState(localStorage.getItem('firstName') || "");
    const [currentLastName, setCurrentLastName] = useState(localStorage.getItem('lastName') || "");

    const dropdownRef = useRef(null); // Ref to handle dropdown close delay

    useEffect(() => {
        if (location.state) {
            const { salutation, firstName, lastName } = location.state;
            if (salutation) {
                setCurrentSalutation(salutation);
                localStorage.setItem('salutation', salutation);
            }
            if (firstName) {
                setCurrentFirstName(firstName);
                localStorage.setItem('firstName', firstName);
            }
            if (lastName) {
                setCurrentLastName(lastName);
                localStorage.setItem('lastName', lastName);
            }
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
        if (path === "/account" && currentSalutation === "Guest") {
            navigate(path, {
                state: {
                    isGuest: true
                }
            });
        } else if (path === "/account" && currentSalutation !== "Guest") {
            navigate(path, {
                state: {
                    salutation: currentSalutation,
                    firstName: currentFirstName,
                    lastName: currentLastName
                }
            });
        } else {
            setDropdownOpen(false);
            navigate(path);
        }
    };

    const handleLogout = async () => {
        try {
            const email = localStorage.getItem('email');
            await axios.post("http://localhost:5000/logout", { email });
            setCurrentSalutation("Guest");
            setCurrentFirstName("");
            setCurrentLastName("");
            localStorage.removeItem('email');
            localStorage.removeItem('salutation');
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            setDropdownOpen(false);
            alert("Logout successful");
            onLogout();
            navigate('/', { replace: true });
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
                    data-test="Ascenda"
                />
                <div className="navItems">
                    <button data-test="registerText" className="navButton" onClick={handleRegister}>
                        Register
                    </button>
                    <div data-test="welcomeMsg" className="dropdown" ref={dropdownRef}>
                        <button className="dropdownButton" onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faUser} /> Welcome, {currentSalutation} {currentFirstName} {currentLastName}!
                            <FontAwesomeIcon icon={faBars} className="menuIcon" />
                        </button>
                        <div className={`dropdownContent ${dropdownOpen ? 'show' : 'hide'}`}>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/login")}>
                                Log in
                            </div>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/account")}>
                                Account Info
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
