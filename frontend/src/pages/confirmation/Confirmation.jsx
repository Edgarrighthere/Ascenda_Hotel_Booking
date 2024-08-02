import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./confirmation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Confirmation = () => {
  const hotel_info = JSON.parse(localStorage.getItem("hotel_info"));
  const { session_id } = useParams();
  const [searchDetails, setSearchDetails] = useState(
    JSON.parse(localStorage.getItem("search_details"))
  );
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsSent, setDetailsSent] = useState(false); // State to track if details have been sent

  const sendBookingDetails = async (session_id, bookingDetails) => {
    try {
      const important_hotel_info = {
        destination: hotel_info.destination,
        address: hotel_info.hotel.address,
        description: hotel_info.hotel.description,
      };

      const response = await axios.post(
        `http://localhost:5000/complete/${session_id}`,
        {
          bookingData: JSON.stringify(bookingDetails),
          searchDetails: JSON.stringify(searchDetails),
          hotelDetails: JSON.stringify(important_hotel_info),
        }
      );
      console.log("Booking confirmed:", response.data);
      setDetailsSent(true); // Set the detailsSent state to true after successful send
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  useEffect(() => {
    const details = localStorage.getItem("bookingDetails");
    if (details && !detailsSent) {
      // Check if details have already been sent
      setBookingDetails(JSON.parse(details));
      setLoading(true);
      sendBookingDetails(session_id, JSON.parse(details));
    } else {
      console.log("bookingDetails not fetched or already sent");
    }
  }, [session_id, detailsSent]); // Add detailsSent as a dependency

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
