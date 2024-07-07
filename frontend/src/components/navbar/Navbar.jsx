import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate(); //use to redirect between pages
    const location = useLocation();

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleLogoClick = () => {
        if (location.pathname !== "/") {
            navigate("/");
        }
    };

    return (
        <div className="navbar"> 
            <div className="navContainer">
                <img 
                    src="images/logo_ascenda.png" 
                    className="logo"
                    onClick={handleLogoClick}
                    alt="Ascenda Logo"
                />
                <div className="navItems">
                    <button className="navButton" onClick={handleRegister}>Register</button>
                    <button className="navButton" onClick={handleLogin}>Log in</button>
                </div>
            </div>
        </div>
    )
};

export default Navbar;