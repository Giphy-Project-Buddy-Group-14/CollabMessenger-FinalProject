import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { getUserData } from "../services/user.service";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseAppConfig";
export const AuthContext = createContext();

import { callSignOut } from "../services/auth.service";

export const AuthProvider = ({ children }) => {
  // const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  // const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    console.log("1 -> auth context");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("2 -> auth context");
      console.log("user -> ", user);
      setCurrentUser(user);
    });

    console.log("3 -> auth context");

    return unsubscribe; // Cleanup subscription

    // const storedAuth = Cookies.get("auth");
    // if (storedAuth) {
    //   const { isAuthenticated, user } = JSON.parse(storedAuth);
    //   setAuthenticated(isAuthenticated);
    //   setUser(user);
    //   const fetchUser = async () => {
    //     const fetchedUserData = await getUserData(user.uid);
    //     setUserData(fetchedUserData);
    //   };
    //   fetchUser();
    // }
    // setIsLoading(false);
  }, []);

  // const login = async (user) => {
  //   setAuthenticated(true);
  //   setUser(user);
  //   const fetchedUserData = await getUserData(user.uid);
  //   setUserData(fetchedUserData);
  //   Cookies.set("auth", JSON.stringify({ isAuthenticated: true, user: user }));
  // };

  const logout = () => {
    callSignOut();
    // setAuthenticated(false);
    // setUser(null);
    // setUserData({});
    // Cookies.remove("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        // isAuthenticated,
        user,
        userData,
        // login,
        logout,
        // isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
