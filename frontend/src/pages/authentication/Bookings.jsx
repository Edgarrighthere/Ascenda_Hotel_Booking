import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const userEmail = localStorage.getItem("email"); // Replace with the actual user email
  console.log("EMAIL", userEmail);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/complete/bookings",
          {
            params: { email: userEmail },
          }
        );
        if (response && response.data) {
          setBookings(response.data);
        } else {
          setError("Failed to fetch bookings.");
        }
      } catch (err) {
        console.log(err);
        setError("An error occurred while fetching bookings.");
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [userEmail]);

  return (
    <div>
      <Navbar />
      <div className="bookingsContainer">
        <div className="bookingsContent">
          <div className="bookingsTitle">Current Bookings</div>
          {error && <div className="error">{error}</div>}
          <div className="bookingsList">
            {bookings.length > 0 ? (
              bookings
                .filter((_, index) => index % 2 !== 0) // Filter for odd indices
                .map((booking, index) => (
                  <div key={index} className="bookingItem">
                    <div className="bookingDetail">
                      <strong>First Name:</strong>{" "}
                      {booking.bookingDetails.leadGuest.firstName}
                    </div>
                    <div className="bookingDetail">
                      <strong>Last Name:</strong>{" "}
                      {booking.bookingDetails.leadGuest.lastName}
                    </div>
                    <div className="bookingDetail">
                      <strong>Email:</strong>{" "}
                      {booking.bookingDetails.leadGuest.email}
                    </div>
                    <div className="bookingDetail">
                      <strong>Phone:</strong>{" "}
                      {booking.bookingDetails.leadGuest.phone}
                    </div>
                    <div className="bookingDetail">
                      <strong>Special Requests:</strong>{" "}
                      {booking.bookingDetails.specialRequests}
                    </div>
                    <div className="bookingDetail">
                      <strong>Room Type:</strong>{" "}
                      {booking.bookingDetails.roomType}
                    </div>
                    <div className="bookingDetail">
                      <strong>Room Only Price:</strong>{" "}
                      {booking.bookingDetails.roomOnlyPrice}
                    </div>
                    <div className="bookingDetail">
                      <strong>Breakfast Price:</strong>{" "}
                      {booking.bookingDetails.breakfastPrice}
                    </div>
                    <div className="bookingDetail">
                      <strong>Cancel Policy:</strong>{" "}
                      {booking.bookingDetails.cancelPolicy}
                    </div>
                    <div className="bookingDetail">
                      <strong>Check-in:</strong>{" "}
                      {new Date(
                        booking.searchDetails.checkin
                      ).toLocaleDateString()}
                    </div>
                    <div className="bookingDetail">
                      <strong>Check-out:</strong>{" "}
                      {new Date(
                        booking.searchDetails.checkout
                      ).toLocaleDateString()}
                    </div>
                    <div className="bookingDetail">
                      <strong>Adults:</strong> {booking.searchDetails.adults}
                    </div>
                    <div className="bookingDetail">
                      <strong>Children:</strong>{" "}
                      {booking.searchDetails.children}
                    </div>
                    <div className="bookingDetail">
                      <strong>Rooms:</strong> {booking.searchDetails.rooms}
                    </div>
                    <div className="bookingDetail">
                      <strong>Days:</strong> {booking.searchDetails.days}
                    </div>
                    <div className="bookingDetail">
                      <strong>Destination:</strong>{" "}
                      {booking.hotelDetails.destination}
                    </div>
                    <div className="bookingDetail">
                      <strong>Address:</strong> {booking.hotelDetails.address}
                    </div>
                    <div className="bookingDetail">
                      <strong>Description:</strong>{" "}
                      {booking.hotelDetails.description}
                    </div>
                  </div>
                ))
            ) : (
              <div className="noBookings">No bookings found.</div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Bookings;
