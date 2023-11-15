import React, { createContext, useContext, useState, useEffect } from 'react';

const CountdownContext = createContext();

export const CountdownProvider = ({ children }) => {
  const [countdown, setCountdown] = useState(
    parseInt(localStorage.getItem('countdown'), 10) || 300
  );

  useEffect(() => {
    localStorage.setItem('countdown', countdown.toString());
  }, [countdown]);

  return (
    <CountdownContext.Provider value={{ countdown, setCountdown }}>
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return context;
};
