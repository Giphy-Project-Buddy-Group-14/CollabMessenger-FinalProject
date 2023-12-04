import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getUserProfileByUID } from '../services/user.service';
import useFirebaseAuth from './useFirebaseAuth';

export function useUserProfile() {
  const { user } = useFirebaseAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfileByUID(user.uid);

          if (profile && profile.id) {
            const dbRef = ref(getDatabase(), 'users/' + profile.id);
            onValue(
              dbRef,
              (snapshot) => {
                if (snapshot.exists()) {
                  const userProfileData = snapshot.val();
                  setUserProfile({
                    ...userProfileData,
                    id: userProfileData.uid,
                  });
                }
                setProfileLoading(false);
              },
              (error) => {
                console.error('Error fetching profile: ', error);
                setProfileLoading(false);
              }
            );

            return () => off(dbRef);
          }
        } catch (error) {
          console.error('Error: ', error);
          setProfileLoading(false);
        }
      } else {
        setProfileLoading(false);
      }
    };

    getUserProfile();
  }, [user]);

  return { userProfile, ...userProfile, profileLoading };
}
