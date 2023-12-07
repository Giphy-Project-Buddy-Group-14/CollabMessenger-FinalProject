import { useState } from 'react';
import { useUserProfile } from './useUserProfile';
import {
  createPrivateMessageRecord,
  deletePrivateMessageRecord,
} from '../services/conversation.service';

export default function useMessage() {
  const { userProfile: author, profileLoading } = useUserProfile();

  const [loading, setLoading] = useState(false);

  const sendMessage = async (conversationId, text) => {
    if (profileLoading) {
      return;
    }

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

  const deleteMessage = async (conversationId, message) => {
    if (profileLoading) {
      return;
    }

    if (!conversationId || !message.id) {
      throw new Error('Both conversation ID and message ID are required');
    }

    if (author.id !== message.authorId) {
      console.error('Error: Unauthorized deletion attempt');
      throw new Error('You are not authorized to delete this message!');
    }

    try {
      setLoading(true);
      await deletePrivateMessageRecord(conversationId, message.id);
    } catch (error) {
      console.error('Error deleting message: ', error);
      throw new Error('An error occurred while deleting the message');
    } finally {
      setLoading(false);
    }
  };

  return {
    author,
    loading: loading || profileLoading,
    sendMessage,
    deleteMessage,
  };
}
