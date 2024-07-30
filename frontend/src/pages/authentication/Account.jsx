import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import axios from 'axios';
import './account.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
    const location = useLocation();
    const user = location.state || {};
    const [userDetails, setUserDetails] = useState(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isGuest, setIsGuest] = useState(user.isGuest || false);

    useEffect(() => {
        if (isGuest) {
            setLoading(false);
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> 'Please log in to view account information'</>);
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://localhost:5000/account/details', {
                    params: {
                        firstName: user.firstName,
                        lastName: user.lastName
                    }
                });
                setUserDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> 'Failed to fetch user details' </>);
                setLoading(false);
            }
        };

        if (user.firstName && user.lastName) {
            fetchUserDetails();
        } else {
            setLoading(false);
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> 'Failed to fetch user details' </>);
        }
    }, [user.firstName, user.lastName]);

    const handleLogout = () => {
        setUserDetails({
            email: '',
            salutation: '',
            firstName: '',
            lastName: '',
            countryCode: '',
            phoneNumber: ''
        });
        setIsGuest(true);
        setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> 'Please log in to view account information'</>);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="accountPage">
            <Navbar onLogout={handleLogout}/>
            <div className="account">
                <div data-test="accountContainer" className="accountContainer">
                    <div data-test="accontTitle" className="accountTitle">Account Information</div>
                    <div className="accountInfo">
                        <p><strong>Email:</strong> {userDetails.email || ' '}</p>
                        <p><strong>Name:</strong> {userDetails.salutation || ' '} {userDetails.firstName || ' '} {userDetails.lastName || ' '}</p>
                        <p><strong>Phone Number:</strong> {userDetails.countryCode || ' '} {userDetails.phoneNumber || ' '}</p>
                    </div>
                    {error && <div className="error">{error}</div>}  
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
