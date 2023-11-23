import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseAppConfig';
export const AuthContext = createContext();

import { logoutUser } from '../services/auth.service';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe; // Cleanup subscription
  }, []);

  const logout = () => {
    logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
