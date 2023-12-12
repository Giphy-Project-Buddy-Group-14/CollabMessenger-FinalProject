import { useEffect, useState, useCallback } from 'react';
import {
  findExistingConversationId,
  createConversationRecord,
  createUserConversationRecords,
} from '../services/conversation.service';
import useParticipants from './useParticipants';
import useMessage from './useMessage';

export default function useConversation() {
  const {
    author,
    participants,
    addParticipant,
    removeParticipant,
    setParticipants,
  } = useParticipants();
  const { sendMessage } = useMessage();

  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check for an existing conversation or create a new one
  const manageConversation = useCallback(async () => {
    if (participants.length < 2) {
      throw new Error('A conversation must include at least two participants');
    }
    setLoading(true);

    try {
      let existingConversationId =
        await findExistingConversationId(participants);
      if (existingConversationId) {
        setConversationId(existingConversationId);
      } else {
        const newConversationId = await createConversationRecord(
          author,
          participants
        );
        setConversationId(newConversationId);
        await createUserConversationRecords(participants, newConversationId);
      }
    } catch (error) {
      console.error('Error in manageConversation: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [author, participants]);

  // Function to send a message within a conversation
  const sendAndCreateConversation = async (text) => {
    try {
      setLoading(true);
      await manageConversation();
      await sendMessage(conversationId, text);
    } catch (error) {
      console.error('Error in sendAndCreateConversation: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (participants.length >= 2) {
      manageConversation();
    } else {
      setConversationId(null);
    }
  }, [participants, manageConversation]);

  return {
    author,
    participants,
    conversationId,
    loading,
    addParticipant,
    removeParticipant,
    setParticipants,
    sendAndCreateConversation,
  };
}
