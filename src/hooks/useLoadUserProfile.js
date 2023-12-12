import { useState, useCallback } from 'react';
import { getUserProfileByUsername } from '../services/user.service';

export default function useLoadUserProfile() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserProfileByUsername = useCallback(async (username) => {
    try {
      setLoading(true);

      const fetchedUserProfile = await getUserProfileByUsername(username);
      setUserProfile(fetchedUserProfile);
    } catch (error) {
      console.error('Error with fetching user profile: ', error);
      setError('Error with fetching user profile');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    userProfile,
    fetchUserProfileByUsername,
  };
}
