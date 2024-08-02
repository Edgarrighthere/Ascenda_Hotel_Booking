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
  const [searchDetails, setSearchDetails] = useState(
    JSON.parse(localStorage.getItem("search_details"))
  );
  const storedSearchDetails = localStorage.getItem("search_details");

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  // function to send bookingDetails to backend
  const sendBookingDetails = async (session_id, bookingDetails) => {
    try {
      console.log("INTHE FUKC:", bookingDetails);
      const response = await axios.post(
        `http://localhost:5000/complete/:${session_id}`,
        {
          bookingData: JSON.stringify(bookingDetails),
        }
      );
      console.log("Booking confirmed:", response.data);
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  useEffect(() => {
    const details = localStorage.getItem("bookingDetails");
    if (details) {
      setBookingDetails(JSON.parse(details));
      setLoading(true);
      // console.log("SESSIONID: ", session_id);
      // console.log("BOOKINGS123: ", bookingDetails);
      sendBookingDetails(session_id, JSON.parse(details));
    } else {
      console.log("bookingDetails not fetched");
    }
  }, []);

  // home button
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

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
          <p className="paragraph">
            Special Requests: {bookingDetails.specialRequests}{" "}
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
