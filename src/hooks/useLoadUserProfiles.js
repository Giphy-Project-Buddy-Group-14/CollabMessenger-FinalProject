import { useState, useEffect } from 'react';
import { getAllUserProfiles } from '../services/user.service';
import { useUserProfile } from './useUserProfile';

export default function useLoadUserProfiles() {
  const { userProfile: author, profileLoading } = useUserProfile();
  const [loading, setLoading] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    if (profileLoading) {
      return;
    }

    try {
      setLoading(true);

      (async function () {
        const allUserProfiles = await getAllUserProfiles();
        setUserProfiles(
          allUserProfiles.filter((profile) => profile.id !== author.id)
        );
      })();
    } catch (error) {
      console.error('Error with loading all user profiles: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [author, profileLoading]);

  return {
    userProfiles,
    loading: loading || profileLoading,
  };
}
