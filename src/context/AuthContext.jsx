import { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedAuth = Cookies.get('auth');
    if (storedAuth) {
      const { isAuthenticated, user } = JSON.parse(storedAuth);

      setAuthenticated(isAuthenticated);
      setUser(user);
    }
  }, []);

  const login = (user) => {
    setAuthenticated(true);
    setUser(user);
    Cookies.set('auth', JSON.stringify({ isAuthenticated: true, user: user }));
  };

  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    Cookies.remove('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}
