import { useEffect, useState } from 'react';
import { useUserProfile } from './useUserProfile';

export default function useParticipants() {
  const { userProfile: author, profileLoading } = useUserProfile();
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (author && !profileLoading) {
      setParticipants([author]);
    }
  }, [author, profileLoading]);

  const validateUser = (user) => {
    if (!user || !user.id) {
      setError('Invalid user object');
      return false;
    }
    return true;
  };

  const addParticipant = (user) => {
    if (validateUser(user)) {
      setParticipants((prevParticipants) => {
        if (
          !prevParticipants.find((participant) => participant.id === user.id)
        ) {
          return [...prevParticipants, user];
        }
        return prevParticipants;
      });
    }
  };

  const removeParticipant = (user) => {
    if (validateUser(user)) {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((participant) => participant.id !== user.id)
      );
    }
  };

  return {
    author,
    participants,
    error,
    addParticipant,
    removeParticipant,
    setParticipants,
  };
}
