import { useState } from 'react';
import { useUserProfile } from './useUserProfile';
import { createPrivateMessageRecord } from '../services/conversation.service';

export default function useMessage() {
  const { userProfile: author } = useUserProfile();

  const [loading, setLoading] = useState(false);

  const sendMessage = async (conversationId, text) => {
    if (!conversationId) {
      throw new Error('Conversation ID cannot be empty');
    }

    if (!text.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      setLoading(true);

      (async () => {
        const result = await createPrivateMessageRecord(
          conversationId,
          author,
          text
        );
        return result;
      })();
    } catch (error) {
      console.error('Error sending message: ', error);
      throw new Error('An error occurred while sending the message');
    } finally {
      setLoading(false);
    }
  };

  return {
    author,
    loading,
    sendMessage,
  };
}
