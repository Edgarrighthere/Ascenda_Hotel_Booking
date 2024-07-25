import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Modal from "../../components/modal/Modal"; // Import the Modal component
import "./account.css";

const Account = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get("http://localhost:4999/account", {
                    params: { userId: 'YOUR_USER_ID' } // Replace 'YOUR_USER_ID' with actual user ID
                });
                if (response && response.data) {
                    const { salutation, firstName, lastName, email, phoneNumber } = response.data;
                    setFullName(`${salutation} ${firstName} ${lastName}`);
                    setEmail(email);
                    setPhoneNumber(phoneNumber);
                } else {
                    setError("Failed to fetch account details.");
                }
            } catch (err) {
                setError("An error occurred while fetching account details.");
                console.error("Error fetching account details:", err);
            }
        };

        fetchAccountDetails();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete("http://localhost:4999/account", {
                params: { userId: 'YOUR_USER_ID' } // Replace 'YOUR_USER_ID' with actual user ID
            });
            setSuccess("Account deleted successfully.");
            setIsModalOpen(false);
        } catch (err) {
            setError("An error occurred while deleting the account.");
            console.error("Error deleting account:", err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="accountContainer">
                <div className="accountContent">
                    <div className="accountTitle">Account Information</div>
                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}
                    <div className="accountDetails">
                        <div className="accountDetail"><strong>Name:</strong> {fullName}</div>
                        <div className="accountDetail"><strong>Email:</strong> {email}</div>
                        <div className="accountDetail"><strong>Phone Number:</strong> {phoneNumber}</div>
                    </div>
                    <button className="deleteAccountButton" onClick={handleOpenModal}>Delete Account</button>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        onConfirm={handleDeleteAccount}
                        message="Are you sure you want to delete your account? This action cannot be undone."
                    />
                </div>
                <div className="footerContainer">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Account;
