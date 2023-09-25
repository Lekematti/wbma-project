import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(false);
  const [theme, setTheme] = useState('light'); // Add theme state here

  const toggleTheme = (newTheme) => {
    setTheme(newTheme); // Update the theme when the function is called
  };

  return (
    <MainContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, update, setUpdate, theme, toggleTheme }}>
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export { MainContext, MainProvider };
