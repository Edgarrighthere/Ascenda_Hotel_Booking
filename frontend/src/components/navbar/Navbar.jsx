import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate(); //use to redirect between pages

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <div className="navbar"> 
            <div className="navContainer">
                <img src="images/logo_ascenda.png" className="logo"></img>
                <div className="navItems">
                    <button className="navButton" onClick={handleRegister}>Register</button>
                    <button className="navButton" onClick={handleLogin}>Log in</button>
                </div>
            </div>
        </div>
    )
};

export default Navbar;