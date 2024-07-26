import { useParams } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Footer from "../../components/footer/Footer";
import './confirmation.css'; // Import the CSS file





//const user = require('../../models/user.js')

const Confirmation = () => {
  let { session_id } = useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  
  useEffect(() => {
    const storedFirstName = localStorage.getItem('firstName') || '';
    const storedLastName = localStorage.getItem('lastName') || '';

    setFirstName(storedFirstName);
    setLastName(storedLastName);
  }, []);
  
  // const [responseData, setResponseData] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchConfirmationData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:3000/confirmation/${session_id}`);
  //       setResponseData(response.data);
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchConfirmationData();
  // }, [session_id]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  // const { bookingId, customerName, roomType, checkInDate, checkOutDate, totalAmount } = responseData;

  const headingStyle = {
    textAlign: 'center',  // Center the text
    marginBottom: '20px',
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2 className="heading">Your payment was successful!</h2>
        
        <p className="paragraph">First Name: {firstName}</p>
        <p className="paragraph">Last Name: {lastName}</p>
        <p className="paragraph">Check-in Date: </p>
        <p className="paragraph">Check-out Date: </p>
        <p className="paragraph">Adults: </p>
        <p className="paragraph">Children: </p>
        <p className="paragraph">Rooms Booked: </p>
        <p className="paragraph">Special Requests: </p>
        <p className="paragraph">Booking reference: {session_id}</p>
      </div>
      <Footer />
    </div>
  );
}

export default Confirmation;