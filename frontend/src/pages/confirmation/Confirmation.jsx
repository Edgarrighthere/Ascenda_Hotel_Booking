import { useParams } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./confirmation.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const Confirmation = () => {
  const [searchDetails, setSearchDetails] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // session id
  let { session_id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const state = JSON.parse(decodeURIComponent(searchParams.get('state')));
  const email = searchParams.get('email');
  const specialRequests = localStorage.getItem("specialRequests");

  const navigate = useNavigate();

  const storedSearchDetails = localStorage.getItem("search_details");
  if (storedSearchDetails && searchDetails === null) {
    setSearchDetails(JSON.parse(storedSearchDetails));
  }

  const handleBackToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const sendConfirmationEmail = async () => {
      try {
        await axios.post('http://localhost:5000/confirmation_email', {
          email: email,
          bookingDetails: state,
        });
        setEmailSent(true);
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    };

    if (!emailSent && loading) {
      sendConfirmationEmail();
    }
  }, [email, state, emailSent, loading]);

  useEffect(() => {
    const details = localStorage.getItem("bookingDetails");
    if (details) {
      setBookingDetails(JSON.parse(details));
      console.log(details);
      setLoading(true);
    } else {
      console.log(details);
    }
  }, []);

  return (
    <div id="root">
      <Navbar />
      {loading && (
        <div className="container">
          <h2 className="heading">Your booking has been confirmed!</h2>
          <p className="paragraph">
            Lead Guest's First Name: {bookingDetails.leadGuest.first_name}
          </p>
          <p className="paragraph">
            Lead Guest's Last Name: {bookingDetails.leadGuest.last_name}
          </p>
          <p className="paragraph">Check-in Date: {searchDetails.checkin} </p>
          <p className="paragraph">Check-out Date: {searchDetails.checkout} </p>
          <p className="paragraph">Adults: {searchDetails.adults}</p>
          <p className="paragraph">Children: {searchDetails.children}</p>
          <p className="paragraph">Rooms Booked: {searchDetails.rooms}</p>
          <p className="paragraph">Special Requests: {specialRequests} </p>
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
