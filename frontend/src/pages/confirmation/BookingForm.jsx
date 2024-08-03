import React, { useState } from "react";
import "./bookingForm.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const BookingForm = () => {
  const [searchDetails, setSearchDetails] = useState(null);
  const storedSearchDetails = localStorage.getItem("search_details");
  if (storedSearchDetails && searchDetails === null) {
    setSearchDetails(JSON.parse(storedSearchDetails));
    // You can now use searchDetails object
  }
  const location = useLocation();
  const [error, setError] = useState("");
  const {
    hotelId,
    roomType,
    roomOnlyPrice,
    breakfastPrice,
    cancelPolicy,
    destinationId,
    destination,
    checkin,
    checkout,
    guests,
    hotelName
  } = location.state || {};

  const [leadGuest, setLeadGuest] = useState({
    first_name: "",
    last_name: "",
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
    setBreakfastPackage(e.target.checked);
  };


 

  const validateEmail = (email) => { 
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

// The validateEmail function ensures the email:
// - Starts with one or more non-whitespace, non-@ characters
// - Contains exactly one @ symbol
// - Follows with one or more non-whitespace, non-@ characters
// - Contains a . symbol after the domain part
// - Ends with one or more non-whitespace, non-@ characters after the .

  const validatePhoneNumber = (phone) => {
    const re = /^\+?\d[\d\s]{6,14}$/; // Optional '+' at the start, number must start with a digit, number must be between 7 - 15 digits 
    const cleanedPhone = phone.replace(/\s+/g, ''); // Remove spaces for length check
    return re.test(String(phone)) && cleanedPhone.length >= 7 && cleanedPhone.length <= 15;
  };
   // account email
  const account_email = localStorage.getItem("email");

  // save input to local storage
  const bookingdata = {
    leadGuest,
    specialRequests,
    roomType,
    roomOnlyPrice,
    breakfastPrice,
    cancelPolicy,
    account_email
  }

  const handleProceedClick = async (e) => {
    e.preventDefault();
    localStorage.setItem("specialRequests", specialRequests);

    if (
      !leadGuest.first_name ||
      !leadGuest.last_name ||
      !leadGuest.email ||
      !leadGuest.phone
    ) {
      setError("Please fill in all required fields.");
      return;
    }


    if (!validateEmail(leadGuest.email)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (!validatePhoneNumber(leadGuest.phone)) {
      setError("Please provide a valid phone number.");
      return;
    }

    const roomOnlyPriceInCents = Math.round(roomOnlyPrice * 100);
    const breakfastPriceInCents = Math.round(breakfastPrice * 100);

    try {
      const response = await axios.post("http://localhost:5000/checkout", {
        hotelName,
        hotelId,
        destinationId,
        destination,
        checkin,
        checkout,
        guests,
        roomType,
        roomOnlyPrice: roomOnlyPriceInCents,
        breakfastPrice: breakfastPriceInCents,
        cancelPolicy,
        leadGuestEmail: leadGuest.email,
        leadGuestFirstName: leadGuest.first_name
      });

      const { id } = response.data;
      const stripe = window.Stripe("pk_test_51PhBxoIrFKgjx0G0vtgffzyhVUjaLsGvvY4JPQXNSypxTUhg2jiluBiMDV6ws23piwulM7jgiI7bgz8NWP1UcSCS00vzlK2lj1");
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="booking-form">
        <h2>Enter Your Booking Details</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleProceedClick}>
          <div>
            <label htmlFor="first_name">First Name:</label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              value={leadGuest.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name:</label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              value={leadGuest.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={leadGuest.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone">Phone Number:</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={leadGuest.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="breakfastPackage">Upgrade to Breakfast Package?</label>
            <div className="checkbox-options">
              <input
                id="breakfastPackage"
                type="checkbox"
                name="breakfastPackage"
                checked={breakfastPackage}
                onChange={handleBreakfastChange}
              />
              <label htmlFor="breakfastPackage"> Yes</label>
            </div>
          </div>
          <div>
            <label htmlFor="specialRequests">Special Requests:</label>
            <textarea
              id="specialRequests"
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
