import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./confirmation.css";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import { format, addDays } from "date-fns";

const Confirmation = () => {
  // session id
  let { session_id } = useParams();

  // name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName") || "";
    const storedLastName = localStorage.getItem("lastName") || "";

    setFirstName(storedFirstName);
    setLastName(storedLastName);
  }, []);

  // start and end dates
  const location = useLocation();
  const state = location.state || {};
  const {
    destination = "",
    date = [{ startDate: "", endDate: "" }],
    options = { adult: 1, children: 0, rooms: 0 },
  } = state;

  const parseDate = (dateString) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate) ? null : parsedDate;
  };

  const startDate = parseDate(date[0]?.startDate);
  const endDate = parseDate(date[0]?.endDate);
  // let checkin = state.date.startDate;
  // let checkout = state.date.endDate;

  // home button
  const handleBackToHome = () => {
    navigate("/");
  };

  const navigate = useNavigate();

  return (
    <div id="root">
      <Navbar />
      <div className="container">
        <h2 className="heading">Your booking has been confirmed!</h2>
        <p className="paragraph">First Name: {firstName}</p>
        <p className="paragraph">Last Name: {lastName}</p>
        <p className="paragraph">
          Check-in Date:{" "}
          {startDate ? format(startDate, "dd/MM/yyyy") : "Invalid Date"}
        </p>
        <p className="paragraph">
          Check-out Date:{" "}
          {endDate ? format(endDate, "dd/MM/yyyy") : "Invalid Date"}
        </p>
        <p className="paragraph">Adults: {options.adult}</p>
        <p className="paragraph">Children: {options.children}</p>
        <p className="paragraph">Rooms Booked: {options.rooms}</p>
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
