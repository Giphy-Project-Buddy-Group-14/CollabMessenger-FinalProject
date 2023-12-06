import { useEffect, useState } from 'react';
import { useUserProfile } from './useUserProfile';

export default function useParticipants(user) {
  const { userProfile: author, profileLoading } = useUserProfile();

  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (author && user && !profileLoading) {
      setParticipants([author, user]);
    }
  }, [author, user, profileLoading]);

  const addParticipant = (user) => {
    setParticipants((prevParticipants) => [...prevParticipants, user]);
  };

  const removeParticipant = (user) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((participant) => participant.id !== user.id)
    );
  };

  return {
    author,
    participants,
    addParticipant,
    removeParticipant,
  };
}
