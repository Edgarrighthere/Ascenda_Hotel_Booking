import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./bookings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faHouse,
  faCircleExclamation
} from "@fortawesome/free-solid-svg-icons";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null); // Start with null to handle default state
  const [error, setError] = useState("");

  const navigate = useNavigate();
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
          } else {
            setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Only registered users can view their existing bookings. </>);
          }
        }
      } catch (err) {
        console.log(err);
        setError(<> <FontAwesomeIcon icon={faCircleExclamation} /> Only registered users can view their existing bookings. </>);
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

  const handleNavigateHome = () => {
    navigate('/');
  };

  if (currentIndex === "") return <div>Loading...</div>;

  return (
    <div className="bookingsPage">
      <Navbar />
      
      <div className="bookingsContainer">
        <button className="navButtonBookToHome" onClick={handleNavigateHome}>
          <FontAwesomeIcon icon={faHouse} className="navIcon1" />
          <div>Back Home</div>
        </button>
        <div className="bookingsContent">
          <div className="bookingsTitle">Current Bookings</div>
          {bookings.length > 0 ? (
            <div className="bookingItem">
              <div className="bookingDetail" data-testid="name">
                <strong>Name:</strong>{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.firstName}{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.lastName}
              </div>
              <div className="bookingDetail" data-testid="email">
                <strong>Email:</strong>{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.email}
              </div>
              <div className="bookingDetail" data-testid="phone_number">
                <strong>Phone:</strong>{" "}
                {bookings[currentIndex].bookingDetails.leadGuest.phone}
              </div>
              <div className="bookingDetail" data-testid="destination">
                <strong>Destination:</strong>{" "}
                {bookings[currentIndex].hotelDetails.destination}
              </div>
              <div className="bookingDetail" data-testid="hotel_name">
                <strong>Hotel:</strong>{" "}
                {bookings[currentIndex].hotelDetails.hotelName}
              </div>
              <div className="bookingDetail" data-testid="hotel_address">
                <strong>Address:</strong> {bookings[currentIndex].hotelDetails.address}
              </div>
              <div className="bookingDetail" data-testid="room_type">
                <strong>Room Type:</strong>{" "}
                {bookings[currentIndex].bookingDetails.roomType}
              </div>
              <div className="bookingDetail" data-testid="roomOnlyPrice">
                <strong>Room Only Price:</strong>{" "}
                S${bookings[currentIndex].bookingDetails.roomOnlyPrice}
              </div>
              <div className="bookingDetail" data-testid="breakfastPrice">
                <strong>Breakfast Price:</strong>{" "}
                S${bookings[currentIndex].bookingDetails.breakfastPrice}
              </div>
              <div className="bookingDetail" data-testid="checkInDate">
                <strong>Check-in:</strong>{" "}
                {new Date(
                  bookings[currentIndex].searchDetails.checkin
                ).toLocaleDateString()}
              </div>
              <div className="bookingDetail" data-testid="checkOutDate">
                <strong>Check-out:</strong>{" "}
                {new Date(
                  bookings[currentIndex].searchDetails.checkout
                ).toLocaleDateString()}
              </div>
              <div className="bookingDetail" data-testid="durationStay">
                <strong>Duration of stay:</strong> {bookings[currentIndex].searchDetails.days} day(s)
              </div>
              <div className="bookingDetail" data-testid="guestInfo">
                <strong>Guest Information:</strong>{" "}
                {bookings[currentIndex].searchDetails.adults} adult(s),{" "}
                {bookings[currentIndex].searchDetails.children} children,{" "}
                {bookings[currentIndex].searchDetails.rooms} room(s)
              </div>
              <div className="bookingDetail" data-testid="cancelPolicy">
                <strong>Cancel Policy:</strong>{" "}
                {bookings[currentIndex].bookingDetails.cancelPolicy}
              </div>
              <div className="bookingDetail" data-testid="specialRequest">
                <strong>Special Requests:</strong>{" "}
                {bookings[currentIndex].bookingDetails.specialRequests}
              </div>
            </div>
          ) : (
            <div className="noBookings" data-testid="noBookings">No bookings found.</div>
          )}
          {error && <div className="error">{error}</div>}
        </div>
        <button
          className="navButtonToggle leftNavButton"
          onClick={handlePrevious}
          disabled={currentIndex === null || currentIndex === bookings.length - 1}
        >
          <FontAwesomeIcon icon={faCircleArrowLeft} className="navIcon" />
          <div>Prev</div>
        </button>
        <button
          className="navButtonToggle rightNavButton"
          onClick={handleNext}
          disabled={currentIndex === null || currentIndex === 0}
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
