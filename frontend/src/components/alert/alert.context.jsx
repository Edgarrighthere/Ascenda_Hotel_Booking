import React, { createContext, useState } from 'react';

const AlertContext = createContext();

const AlertContextProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  return (
    <AlertContext.Provider value={[alert, setAlert]}>
      {children}
    </AlertContext.Provider>
  );
};

export { AlertContext };
export default AlertContextProvider;
