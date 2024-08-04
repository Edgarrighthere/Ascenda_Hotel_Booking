import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./confirmation.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Confirmation = () => {
  const location = useLocation();
  const bookingFormDetails = JSON.parse(
    localStorage.getItem("bookingFormDetails")
  ); // firstName, lastName, email, phone, specialRequests
  const [searchDetails, setSearchDetails] = useState(
    JSON.parse(localStorage.getItem("search_details"))
  ); // adult, children, checkin, checkout, days, rooms (FROM FIRST PAGE)
  // session id
  let { session_id } = useParams(); //SESSION ID
  const searchParams = new URLSearchParams(location.search);
  const state = JSON.parse(decodeURIComponent(searchParams.get("state")));
  //console.log("STATE:", state); //hotelId, roomType,roomOnlyPrice, breakfastPrice, cancelPolicy, destinationId, destination, checkin, checkout, guests, leadGuestEmail, leadGuestFirstName, hotelName

  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [detailsSent, setDetailsSent] = useState(false);

  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };
  useEffect(() => {
    sendBookingDetails();
  }, []);

  const sendBookingDetails = async () => {
    if (!detailsSent) {
      try {
        const response = await axios.post(
          `http://localhost:5000/complete/${session_id}`,
          {
            email: bookingFormDetails.email,
            firstName: bookingFormDetails.firstName,
            lastName: bookingFormDetails.lastName,
            phone: bookingFormDetails.phone,
            specialRequests: bookingFormDetails.specialRequests,
            roomType: state.roomType,
            roomOnlyPrice: (state.roomOnlyPrice / 100).toFixed(2),
            breakfastPrice: (state.breakfastPrice / 100).toFixed(2),
            cancelPolicy: state.cancelPolicy,
            checkin: searchDetails.checkin,
            checkout: searchDetails.checkout,
            adults: searchDetails.adults,
            children: searchDetails.children,
            rooms: searchDetails.rooms,
            days: searchDetails.days,
            destination: state.destination,
            address: state.address,
            description: state.description,
            hotelName: state.hotelName,
          }
        );
        console.log("Booking confirmed:", response.data);
        setLoading(true);
        sendConfirmationEmail();
        setDetailsSent(true);
      } catch (error) {
        console.error("Error sending booking details:", error);
        // Handle error (e.g., display error message)
        setLoading(false);
      }
    }
  };

  const sendConfirmationEmail = async () => {
    if (!emailSent) {
      try {
        await axios.post("http://localhost:5000/confirmation_email", {
          email: bookingFormDetails.email,
          firstName: bookingFormDetails.firstName,
          hotelName: state.hotelName,
          bookingDetails: state,
        });
        setEmailSent(true);
      } catch (error) {
        console.error("Error sending confirmation email:", error);
      }
    }
  };
  return (
    <div id="root">
      <Navbar />
      {loading && (
        <div className="container">
          <h2 className="heading">Your booking has been confirmed!</h2>
          <p className="paragraph">
            Guest's Name: {bookingFormDetails.firstName} {bookingFormDetails.lastName}
          </p>
          <p className="paragraph">Check-in Date: {searchDetails.checkin} </p>
          <p className="paragraph">Check-out Date: {searchDetails.checkout} </p>
          <p className="paragraph">Adults: {searchDetails.adults}</p>
          <p className="paragraph">Children: {searchDetails.children}</p>
          <p className="paragraph">Rooms Booked: {searchDetails.rooms}</p>
          <p className="paragraph">
            Special Requests: {bookingFormDetails.specialRequests}{" "}
          </p>
          <p className="paragraph">Booking reference: {session_id}</p>
        </div>
      )}
      <div className="button-container">
        <button onClick={handleBackToHome} className="backToHomeButton">
          Back to Home
        </button>
      </div>
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default Confirmation;
