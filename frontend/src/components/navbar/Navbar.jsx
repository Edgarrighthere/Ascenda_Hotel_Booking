import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleRegister = () => {
        navigate("/register");
    };

    const handleLogoClick = () => {
        if (location.pathname !== "/") {
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
                    <button className="navButton" onClick={handleRegister}>Register</button>
                    <div className="dropdown">
                        <button className="dropdownButton" onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faUser} /> Welcome, {user?.username || "Guest"}
                            <FontAwesomeIcon icon={faBars} className="menuIcon" />
                        </button>
                        <div className={`dropdownContent ${dropdownOpen ? 'show' : 'hide'}`}>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/login")}>Log in</div>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/account")}>Account info.</div>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/bookings")}>Bookings</div>
                            <div className="dropdownItem" onClick={() => handleOptionClick("/logout")}>Log out</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

