import { useEffect, useState } from 'react';
import useRealtimeFirebaseData from './useRealtimeFirebaseData';
import { getConversationById } from '../services/conversation.service';
import { getUserProfileByUID } from '../services/user.service';

export default function useLoadConversation(conversationId) {
  const conversationPath = conversationId
    ? `privateMessages/${conversationId}`
    : null;

  const realtimeData = useRealtimeFirebaseData(conversationPath);
  const [userProfiles, setUserProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    if (realtimeData.data) {
      setMessagesCount(Object.keys(realtimeData.data).length);
    }
  }, [realtimeData.data]);

  useEffect(() => {
    if (!conversationId) {
      setUserProfiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      (async () => {
        const conversationData = await getConversationById(conversationId);
        const fetchedUserProfiles = [];
        for (const participantId in conversationData.participants) {
          const profile = await getUserProfileByUID(participantId);
          fetchedUserProfiles.push(profile);
        }
        setUserProfiles(fetchedUserProfiles);
      })();
    } catch (error) {
      console.error('Error with fetching messages: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const { data, ...otherData } = realtimeData;
  return { messages: data, messagesCount, ...otherData, userProfiles, loading };
}
