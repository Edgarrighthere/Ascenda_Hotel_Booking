import { useParams } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./confirmation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//import { format, addDays } from "date-fns";

const Confirmation = () => {

  const { session_id } = useParams();

  const [searchDetails, setSearchDetails] = useState(localStorage.getItem("search_details"));
  const storedSearchDetails = localStorage.getItem("search_details");

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // function to send bookingDetails to backend
  const sendBookingDetails = async () => {
    try {
      const response = await axios.post('http://localhost:5000/complete/:session_id', {
        bookingData: bookingDetails
      });
      console.log('Booking confirmed:', response.data);
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  useEffect(() => {
    const details = localStorage.getItem("bookingDetails");
    if (details) {
      setBookingDetails(JSON.parse(details));
      setLoading(true);
      sendBookingDetails();
    } else {
      console.log("bookingDetails not fetched");
    }
  }, []);

  // home button
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  // function to send searchDetails to backend
  const sendSearchDetails = async () => {
    try {
      console.log("TEST")
      const response = await axios.post('http://localhost:5000/complete/:session_id', {
        searchData: searchDetails
      });
      console.log('Booking confirmed:', response.data);
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  if (storedSearchDetails && searchDetails === null) {
    setSearchDetails(JSON.parse(storedSearchDetails));
  //   // You can now use searchDetails object
    sendSearchDetails();
   }

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
          <p className="paragraph">Special Requests: {bookingDetails.specialRequests} </p>
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
