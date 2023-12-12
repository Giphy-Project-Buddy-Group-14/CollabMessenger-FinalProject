import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseAppConfig';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getUserProfileByUID } from '../services/user.service';

export const AuthContext = createContext();

import { registerUser, signIn, logoutUser } from '../services/auth.service';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Loading state for authentication
  const [profileLoading, setProfileLoading] = useState(true); // Loading state for user profile
  const [error, setError] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const fetchUserProfile = async (uid) => {
    try {
      let userProfile = await getUserProfileByUID(uid);

      if (userProfile) {
        setCurrentUserProfile(userProfile);
      } else {
        // Handle no profile case
        setCurrentUserProfile(null);
      }

      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    }
  };

  const setupUserProfileListener = (userProfileId) => {
    if (!userProfileId) return;

    const dbRef = ref(getDatabase(), 'users/' + userProfileId);
    const unsubscribeDB = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const userProfileData = snapshot.val();
        setCurrentUserProfile({
          ...userProfileData,
          id: userProfileData.uid,
        });
      } else {
        setCurrentUserProfile(null);
      }
    });

    return () => {
      off(dbRef);
      unsubscribeDB();
    };
  };

  // Combine loading states for context value
  const loading = authLoading || profileLoading;

  const isAuthenticated = !!currentUser;

  const startLoading = () => {
    setAuthLoading(true);
    setProfileLoading(true);
  };

  const stopLoading = () => {
    setAuthLoading(false);
    setProfileLoading(false);
  };

  const register = async (email, password, username) => {
    try {
      startLoading();
      const user = await registerUser(email, password, username);
      setCurrentUser(user);
      const userProfile = await fetchUserProfile(user.uid);
      return userProfile;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message);
    } finally {
      stopLoading();
    }
  };

  const login = async (email, password) => {
    try {
      startLoading();
      const user = await signIn(email, password);
      setCurrentUser(user);
      await fetchUserProfile(user.uid);
      setupUserProfileListener(user.uid);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      stopLoading();
    }
  };

  const logout = async () => {
    try {
      startLoading();
      await logoutUser();
      setCurrentUser(null);
      setCurrentUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        startLoading();
        try {
          await fetchUserProfile(user.uid);
          setupUserProfileListener(user.uid);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError(error.message);
        } finally {
          stopLoading();
        }
      } else {
        setCurrentUser(null);
        setCurrentUserProfile(null);
        stopLoading();
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        isAuthenticated,
        currentUserProfile,
        currentUser,
        register,
        login,
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
