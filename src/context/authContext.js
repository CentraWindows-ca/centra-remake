import React, { createContext, useContext, useState, useCallback } from 'react';
import { useDispatch } from "react-redux";

import { updateUserData } from "../app/redux/app";

const AuthDataContext = createContext();

export function AuthDataProvider({ children }) {
  const dispatch = useDispatch();

  const [loggedInUser, setLoggedInUser] = useState(null);

  const onAuthNavAction = useCallback((actionType, featurePermissions, user) => {
    dispatch(updateUserData(user));    
    setLoggedInUser(user);
  }, [dispatch]);

  return (
    <AuthDataContext.Provider value={{ loggedInUser, onAuthNavAction }}>
      {children}
    </AuthDataContext.Provider>
  );
}

// Create a custom hook for consuming the context
export function useAuthData() {
  return useContext(AuthDataContext);
}