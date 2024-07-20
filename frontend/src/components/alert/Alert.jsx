import React, { useContext } from 'react';
import { AlertContext } from './alert.context';
import './Alert.css'; // Create and style this file as needed

const Alert = () => {
  const [alert] = useContext(AlertContext);

  if (!alert) return null;

  return (
    <div className={`alert alert-${alert.type}`}>
      {alert.text}
    </div>
  );
};

export default Alert;
