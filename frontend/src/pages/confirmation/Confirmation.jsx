import { useParams } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./confirmation.css";
import { useNavigate, useLocation } from "react-router-dom";

//import { format, addDays } from "date-fns";

const Confirmation = () => {
  const [searchDetails, setSearchDetails] = useState(null);
  const storedSearchDetails = localStorage.getItem("search_details");
  if (storedSearchDetails && searchDetails === null) {
    setSearchDetails(JSON.parse(storedSearchDetails));
    // You can now use searchDetails object
  }

  // session id
  let { session_id } = useParams();

  // start and end dates
  // const location = useLocation();
  // const state = location.state || {};
  // const {
  //   destination = "",
  //   date = [{ startDate: "", endDate: "" }],
  //   options = { adult: 1, children: 0, rooms: 0 },
  // } = state;

  // home button
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  // const [bookingData, setBookingData] = useState(null);
  // useEffect(() => {
  //   const data = localStorage.getItem('bookingData');
  //   setBookingData(data);
  //   console.log(bookingData);
  // }, [bookingData]);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const details = localStorage.getItem("bookingDetails");
    if (details) {
      setBookingDetails(JSON.parse(details));
      console.log(details);
      setLoading(true);
    } else {
      console.log(details);
    }
    //console.log(details);
  }, []);

  // const parseDate = (dateString) => {
  //   const parsedDate = new Date(dateString);
  //   return isNaN(parsedDate) ? null : parsedDate;
  // };

  // const startDate = parseDate(date[0]?.startDate);
  // const endDate = parseDate(date[0]?.endDate);
  // let checkin = state.date.startDate;
  // let checkout = state.date.endDate;

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
          <p className="paragraph">Check-in Date:{searchDetails.checkin} </p>
          <p className="paragraph">Check-out Date:{searchDetails.checkout} </p>
          <p className="paragraph">Adults: {searchDetails.adults}</p>
          <p className="paragraph">Children: {searchDetails.children}</p>
          <p className="paragraph">Rooms Booked: {searchDetails.rooms}</p>
          <p className="paragraph">Special Requests: {} </p>
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
