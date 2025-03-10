import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Modal from "../../components/modal/Modal";
import axios from 'axios';
import './account.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faHouse } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
    const location = useLocation();
    const user = location.state || {};
    const [userDetails, setUserDetails] = useState(user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isGuest, setIsGuest] = useState(user.isGuest || false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isGuest) {
            setLoading(false);
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Please log in to view account information</>);
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
                setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Failed to fetch user details </>);
                setLoading(false);
            }
        };

        if (user.firstName && user.lastName) {
            fetchUserDetails();
        } else {
            setLoading(false);
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Failed to fetch user details </>);
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
        setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Please log in to view account information</>);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            // Send a request to generate and send an OTP to the user's email
            await axios.post('http://localhost:5000/send_delete_otp', {
                email: userDetails.email
            });
    
            // Redirect to the InputOTP page
            navigate('/inputOTP', { 
                state: { 
                    email: userDetails.email, 
                    isDeletion: true
                }
            });
    
            handleCloseModal();
        } catch (error) {
            console.error('Error initiating account deletion:', error);
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Failed to initiate account deletion </>);
        }
    };

    const handleNavigateHome = () => {
        navigate('/');
    };

    if (loading) return <div data-testid="loading">Loading...</div>;

    return (
        <div className="accountPage">
            <Navbar onLogout={handleLogout}/>
            <button
                className="navButtonAccToHome"
                onClick={handleNavigateHome}
                >
                <FontAwesomeIcon icon={faHouse} className="navIcon" />
                <div>Back Home</div>
            </button>
            <div className="account">
                <div data-test="accountContainer" data-testid="accountContainer" className="accountContainer" >
                    <div data-test="accontTitle" data-testid="accountTitle" className="accountTitle">Account Information</div>
                    <div className="accountInfo">
                        <p><strong>Email:</strong> <span data-testid="userEmail">{userDetails.email || ' '}</span></p>
                        <p><strong>Name:</strong> <span data-testid="userName">{userDetails.salutation || ' '} {userDetails.firstName || ' '} {userDetails.lastName || ' '}</span></p>
                        <p><strong>Phone Number:</strong> <span data-testid="userPhoneNumber">{userDetails.countryCode || ' '} {userDetails.phoneNumber || ' '}</span></p>
                    </div>
                    <button 
                        data-testid="deleteAccountButton" 
                        className="deleteAccountButton" 
                        onClick={handleOpenModal} >Delete Account
                    </button>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onConfirm={handleDeleteAccount}
                        message="Are you sure you want to delete your account? This action cannot be undone."
                    />
                    {error && <div data-testid="error" className="error">{error}</div>}  
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
