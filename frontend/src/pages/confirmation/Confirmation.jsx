import { useParams } from 'react-router-dom';
import React from 'react';

const Confirmation = () => {
  let { session_id } = useParams();

  return (
    <div>
      <h2>Your payment was successful!</h2>
      <p>Session ID: {session_id}</p>
    </div>
  );
}

export default Confirmation;