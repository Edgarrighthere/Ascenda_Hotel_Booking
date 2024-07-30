import { useParams } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./confirmation.css";
import { useNavigate, useLocation } from "react-router-dom";
//import { format, addDays } from "date-fns";

const Confirmation = () => {
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
  
  const [bookingDetails, setBookingDetails] = useState(null);
  
  useEffect(() => {
    const details = localStorage.getItem('bookingDetails');
    if (details) {
      setBookingDetails(JSON.parse(details));
      console.log(details)
    }else{
      console.log(details)
    }
    //console.log(details);
  }, [])
 
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
      <div className="container">
        <h2 className="heading">Your booking has been confirmed!</h2>
        <p className="paragraph">Lead Guest's First Name: {bookingDetails.leadGuest.first_name}</p>
        <p className="paragraph">Lead Guest's Last Name: {bookingDetails.leadGuest.last_name}</p>
        <p className="paragraph">Check-in Date:{" "}</p>
        <p className="paragraph">Check-out Date: {" "}</p>
        <p className="paragraph">Adults: {/*options.adult*/}</p>
        <p className="paragraph">Children: {/*options.children*/}</p>
        <p className="paragraph">Rooms Booked: {/*options.rooms*/}</p>
        <p className="paragraph">Special Requests: {} </p>
        <p className="paragraph">Booking reference: {session_id}</p>
      </div>
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
