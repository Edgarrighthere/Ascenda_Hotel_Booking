import React from "react";
import { useState } from "react";
import "./bookingForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const BookingForm = () => {
  const location = useLocation();
  const [error, setError] = useState("");
  const { roomType, roomOnlyPrice, breakfastPrice, cancelPolicy } =
    location.state || {};

  const [leadGuest, setLeadGuest] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [breakfastPackage, setBreakfastPackage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadGuest((prev) => ({ ...prev, [name]: value }));
  };

  const handleBreakfastChange = (e) => {
    setBreakfastPackage((prevState) => !prevState);
  };

  const navigate = useNavigate();

  const handleProceedClick = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (
      !leadGuest.firstName ||
      !leadGuest.lastName ||
      !leadGuest.email ||
      !leadGuest.phone
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const roomOnlyPriceInCents = Math.round(roomOnlyPrice * 100);
    const breakfastPriceInCents = Math.round(breakfastPrice * 100);

    try {
      const response = await axios.post("http://localhost:5000/checkout", {
        roomType,
        roomOnlyPrice: roomOnlyPriceInCents,
        breakfastPrice: breakfastPriceInCents,
        cancelPolicy,
      });

      const { id } = response.data;
      const stripe = window.Stripe(
        "pk_test_51PhBxoIrFKgjx0G0vtgffzyhVUjaLsGvvY4JPQXNSypxTUhg2jiluBiMDV6ws23piwulM7jgiI7bgz8NWP1UcSCS00vzlK2lj1"
      ); // Stripe publishable key
      await stripe.redirectToCheckout({ sessionId: id });

      navigate("/complete/:session_id", {
        state: {
          leadGuest,
          specialRequests,
          breakfastPackage,
          roomType,
          roomOnlyPrice,
          breakfastPrice,
          cancelPolicy,
        },
      });
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="booking-form">
        <h2>Booking Form</h2>

        {/* <p>Room Type: {roomType}</p>
        <p>Room Only Price: {roomOnlyPrice}</p>
        <p>Breakfast Price: {breakfastPrice}</p>
        <p>Cancel Policy: {cancelPolicy}</p> */}

        <form onSubmit={handleProceedClick}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={leadGuest.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={leadGuest.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={leadGuest.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={leadGuest.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Upgrade to Breakfast Package?</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <label> Yes</label>
              <input
                type="checkbox"
                name="breakfastPackage"
                checked={breakfastPackage}
                onChange={handleBreakfastChange}
              />
            </div>
          </div>
          <div>
            <label>Special Requests:</label>
            <textarea
              name="specialRequests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>
          <button type="submit">Proceed to Payment</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default BookingForm;
