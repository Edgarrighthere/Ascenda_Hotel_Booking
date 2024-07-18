import React, { useState, useEffect } from "react";
import "./register.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEye,
    faEyeSlash,
    faCircleExclamation, 
    faCheck
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import countryCodesList from 'country-codes-list';

const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [salutation, setSalutation] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleRegister = async () => {
        setError(""); // Clear previous errors
        setSuccess(""); // Clear previous success messages

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!email || !password || !confirmPassword || !salutation || !firstName || !lastName || !countryCode || !phoneNumber) {
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Check that all fields are filled </>);
        } else if (password !== confirmPassword) {
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Passwords do not match </>);
        } else if (!passwordRegex.test(password)) {
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Password must be at least 8 characters long, contain at least one uppercase letter, and one special character (!@#$%^&*) </>);
        } else {
            try {
                const response = await axios.post("http://localhost:5001/register", {
                    email: email,
                    username: username,
                    password: password,
                    salutation: salutation,
                    firstName: firstName,
                    lastName: lastName,
                    countryCode: countryCode,
                    phoneNumber: phoneNumber,
                });

                setSuccess(<> <FontAwesomeIcon icon={faCheck} /> {response.data.message} </>);
            } catch (err) {
                setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> {err.response.data.message} </> || "An error occurred. Please try again.");
            }
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const countryCodeOptions = countryCodesList.customList(
        'countryNameEn',
        '{countryCallingCode}'
    );

    const sortedCountryCodeOptions = Object.entries(countryCodeOptions)
        .sort(([a], [b]) => a.localeCompare(b));

    return (
        <div className="registerPage">
            <Navbar />
            <div className="register">
                <div className="registerContainer">
                    <div className="registerTitle">Register</div>
                    <div className="registerRow">
                        <div className="salutationInputContainer">
                            <select
                                value={salutation}
                                onChange={(e) => setSalutation(e.target.value)}
                                className="registerInputSalutation"
                            >
                                <option value="">Select Salutation</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mdm">Mdm</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter your first name"
                            className="registerInputFirstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Enter your last name"
                        className="registerInput"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Enter a registered email, eg. someone123@gmail.com"
                        className="registerInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="registerRow">
                        <div className="countryCodeInputContainer">
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="registerInputCountryCode"
                            >
                                <option value="">Select Country Code</option>
                                {sortedCountryCodeOptions.map(([country, code]) => (
                                    <option key={code} value={`+${code}`}>{`${country} (+${code})`}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            className="registerInputPhoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className="passwordInputContainer">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Enter your password."
                            className="registerInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={togglePasswordVisibility} className="passwordToggleIcon">
                            {passwordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <div className="passwordInputContainer">
                        <input
                            type={confirmPasswordVisible ? "text" : "password"}
                            placeholder="Re-enter your password."
                            className="registerInput"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span onClick={toggleConfirmPasswordVisibility} className="passwordToggleIcon">
                            {confirmPasswordVisible ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </span>
                    </div>
                    <div className="registerbuttonContainer">
                        <button className="registerButton" onClick={handleRegister}>Register Now!</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}
                </div>
            </div> 
            <Footer />
        </div>
    );
};

export default Register;
