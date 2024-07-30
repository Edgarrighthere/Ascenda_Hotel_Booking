import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import axios from 'axios';
import './account.css';

const Account = () => {
    const location = useLocation();
    const user = location.state || {};
    const [userDetails, setUserDetails] = useState(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
                setError('Failed to fetch user details');
                setLoading(false);
            }
        };

        if (user.firstName && user.lastName) {
            fetchUserDetails();
        } else {
            setLoading(false);
        }
    }, [user.firstName, user.lastName]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="accountPage">
            <Navbar />
            <div className="accountContainer">
                <h1>Account Details</h1>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Salutation:</strong> {userDetails.salutation}</p>
                <p><strong>First Name:</strong> {userDetails.firstName}</p>
                <p><strong>Last Name:</strong> {userDetails.lastName}</p>
                <p><strong>Country Code:</strong> {userDetails.countryCode}</p>
                <p><strong>Phone Number:</strong> {userDetails.phoneNumber}</p>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
