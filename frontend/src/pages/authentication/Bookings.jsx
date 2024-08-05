import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./bookings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight
} from "@fortawesome/free-solid-svg-icons";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null); // Start with null to handle default state
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
          if (response.data.length > 0) {
            setCurrentIndex(response.data.length - 1); // Set default to the latest booking
          }
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

  const handleNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex < bookings.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (currentIndex === null) return <div>Loading...</div>;

  return (
    <div className="bookingsPage">
      <Navbar />
      <div className="bookingsContainer">
        <div className="bookingsContent">
          <div className="bookingsTitle">Current Bookings</div>
          {bookings.length > 0 ? (
            <div className="bookingItem">
              <div className="bookingDetail">
                <strong>Name:</strong>{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.firstName}{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.lastName}
              </div>
              <div className="bookingDetail">
                <strong>Email:</strong>{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.email}
              </div>
              <div className="bookingDetail">
                <strong>Phone:</strong>{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.phone}
              </div>
              <div className="bookingDetail">
                <strong>Destination:</strong>{" "}
                {bookings[currentIndex].hotelDetails.destination}
              </div>
              <div className="bookingDetail">
                <strong>Hotel:</strong>{" "}
                {bookings[currentIndex].hotelDetails.hotelName}
              </div>
              <div className="bookingDetail">
                <strong>Address:</strong> {bookings[currentIndex].hotelDetails.address}
              </div>
              <div className="bookingDetail">
                <strong>Room Type:</strong>{" "}
                {bookings[currentIndex].bookingDetails.roomType}
              </div>
              <div className="bookingDetail">
                <strong>Room Only Price:</strong>{" "}
                S${bookings[currentIndex].bookingDetails.roomOnlyPrice}
              </div>
              <div className="bookingDetail">
                <strong>Breakfast Price:</strong>{" "}
                S${bookings[currentIndex].bookingDetails.breakfastPrice}
              </div>
              <div className="bookingDetail">
                <strong>Check-in:</strong>{" "}
                {new Date(
                  bookings[currentIndex].searchDetails.checkin
                ).toLocaleDateString()}
              </div>
              <div className="bookingDetail">
                <strong>Check-out:</strong>{" "}
                {new Date(
                  bookings[currentIndex].searchDetails.checkout
                ).toLocaleDateString()}
              </div>
              <div className="bookingDetail">
                <strong>Duration of stay:</strong> {bookings[currentIndex].searchDetails.days} day(s)
              </div>
              <div className="bookingDetail">
                <strong>Guest Information:</strong>{" "}
                {bookings[currentIndex].searchDetails.adults} adult(s),{" "}
                {bookings[currentIndex].searchDetails.children} children,{" "}
                {bookings[currentIndex].searchDetails.rooms} room(s)
              </div>
              <div className="bookingDetail">
                <strong>Cancel Policy:</strong>{" "}
                {bookings[currentIndex].bookingDetails.cancelPolicy}
              </div>
              <div className="bookingDetail">
                <strong>Special Requests:</strong>{" "}
                {bookings[currentIndex].bookingDetails.specialRequests}
              </div>
            </div>
          ) : (
            <div className="noBookings">No bookings found.</div>
          )}
          {error && <div className="error">{error}</div>}
        </div>
        <button
          className="navButton leftNavButton"
          onClick={handlePrevious}
          disabled={currentIndex === bookings.length - 1}
        >
          <FontAwesomeIcon icon={faCircleArrowLeft} className="navIcon" />
          <div>Prev</div>
        </button>
        <button
          className="navButton rightNavButton"
          onClick={handleNext}
          disabled={currentIndex === 0}
        >
          <FontAwesomeIcon icon={faCircleArrowRight} className="navIcon" />
          <div>Next</div>
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;
