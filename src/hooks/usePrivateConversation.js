import { useEffect } from 'react';
import useConversation from './useConversation';

export default function usePrivateConversation(userProfile) {
  const {
    author,
    conversationId,
    loading,
    setParticipants,
    createConversationNode,
  } = useConversation();

  useEffect(() => {
    // if (loading) {
    //   return;
    // }
    if (conversationId) {
      return;
    }

    setParticipants([author, userProfile]);

    createConversationNode();
  }, [
    conversationId,
    createConversationNode,
    author,
    userProfile,
    setParticipants,
  ]);

  return {
    loading,
    conversationId,
  };
}
