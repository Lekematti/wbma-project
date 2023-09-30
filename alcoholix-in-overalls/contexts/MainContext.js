import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {createContext} from 'react';

const MainContext = React.createContext({});

const AppContext = createContext();

const AppContextProvider = ({children}) => {
  const [theme,setTheme] = useState('light');
  return (
    <AppContext.Provider value={{theme,setTheme}}>
      {children}
    </AppContext.Provider>
  )
}
const MainProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(false);


  return (
    <MainContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, user, setUser, update, setUpdate,}}>
      {props.children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export { MainContext, MainProvider, AppContext, AppContextProvider };
