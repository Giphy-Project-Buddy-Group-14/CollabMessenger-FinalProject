import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseAppConfig";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { fetchUserProfile } from "../services/user.service";

const useFirebaseAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  const isAuthenticated = !!user; // true if user is not null

  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      if (user) {
        try {
          const profile = await fetchUserProfile(user.uid);

          if (profile && profile.username) {
            const dbRef = ref(getDatabase(), "users/" + profile.username);
            onValue(
              dbRef,
              (snapshot) => {
                if (snapshot.exists()) {
                  setUserProfile(snapshot.val());
                }
                setProfileLoading(false);
              },
              (error) => {
                console.error("Error fetching profile: ", error);
                setProfileLoading(false);
              }
            );

            return () => off(dbRef);
          }
        } catch (error) {
          console.error("Error: ", error);
          setProfileLoading(false);
        }
      } else {
        setProfileLoading(false);
      }
    };

    getUserProfile();
  }, [user]);

  return { user, loading, error, isAuthenticated, userProfile, profileLoading };
};

export default useFirebaseAuth;
