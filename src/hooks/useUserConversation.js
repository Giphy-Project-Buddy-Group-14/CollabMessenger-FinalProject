import { useState } from 'react';
import { createUserConversationRecords } from '../services/conversation.service';

export default function useUserConversation() {
  const [loading, setLoading] = useState(false);

  const createUserConversationNode = async (conversationId, participants) => {
    if (!conversationId) {
      throw new Error('Conversation ID cannot be empty');
    }

    if (participants.length < 2) {
      throw new Error('A conversation must include at least two participants');
    }

    try {
      setLoading(true);

      (async () => {
        await createUserConversationRecords(participants, conversationId);
      })();
    } catch (error) {
      console.error('Error sending message: ', error);
      throw new Error('An error occurred while sending the message');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createUserConversationNode,
  };
}
