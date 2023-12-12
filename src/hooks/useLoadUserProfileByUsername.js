import { useEffect } from 'react';
import useLoadUserProfile from './useLoadUserProfile';

export default function useLoadUserProfileByUsername(username) {
  const { loading, error, userProfile, fetchUserProfileByUsername } =
    useLoadUserProfile();

  useEffect(() => {
    fetchUserProfileByUsername(username);
  }, [username, fetchUserProfileByUsername]);

  return {
    loading,
    error,
    userProfile,
  };
}
