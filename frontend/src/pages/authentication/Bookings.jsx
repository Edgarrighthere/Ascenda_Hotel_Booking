import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./bookings.css";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:5000/bookings", {
                    params: { userId: 'YOUR_USER_ID' } // Replace 'YOUR_USER_ID' with actual user ID if needed
                });
                if (response && response.data) {
                    setBookings(response.data);
                } else {
                    setError("Failed to fetch bookings.");
                }
            } catch (err) {
                setError("An error occurred while fetching bookings.");
                console.error("Error fetching bookings:", err);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="bookingsContainer">
                <div className="bookingsContent">
                    <div className="bookingsTitle">Current Bookings</div>
                    {error && <div className="error">{error}</div>}
                    <div className="bookingsList">
                        {bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <div key={index} className="bookingItem">
                                    <div className="bookingDetail"><strong>Country:</strong> {booking.country}</div>
                                    <div className="bookingDetail"><strong>Hotel Name:</strong> {booking.hotelName}</div>
                                    <div className="bookingDetail"><strong>Date:</strong> {booking.date}</div>
                                    <div className="bookingDetail"><strong>Time:</strong> {booking.time}</div>
                                </div>
                            ))
                        ) : (
                            <div className="noBookings">No bookings found.</div>
                        )}
                    </div>
                </div>
                <div className="footerContainer">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Bookings;
