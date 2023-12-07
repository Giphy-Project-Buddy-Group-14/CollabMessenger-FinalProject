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

  const getConversationId = useCallback(async () => {
    try {
      if (participants.length < 2) {
        throw new Error(
          'A conversation must include at least two participants'
        );
      }

      const conversationId = await findExistingConversationId(participants);
      return conversationId;
    } catch (error) {
      console.error('Error with finding conversation ID: ', error);
      throw error;
    }
  }, [participants]);

  const createConversationAndSendMessage = async (text) => {
    try {
      setLoading(true);

      if (participants.length < 2) {
        throw new Error(
          'A conversation must include at least two participants'
        );
      }

      const newConversationId = await createConversationRecord(
        author,
        participants
      );
      setConversationId(newConversationId);

      await createUserConversationNode(newConversationId);
      await sendMessage(newConversationId, text);

      return newConversationId;
    } catch (error) {
      console.error('Error with finding conversation ID: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createConversationNode = async () => {
    try {
      setLoading(true);

      if (participants.length < 2) {
        throw new Error(
          'A conversation must include at least two participants'
        );
      }

      const newConversationId = await createConversationRecord(
        author,
        participants
      );
      setConversationId(newConversationId);
      return newConversationId;
    } catch (error) {
      console.error('Error with finding conversation ID: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUserConversationNode = async (conversationId) => {
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

  useEffect(() => {
    if (participants.length < 2) {
      setConversationId(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      (async () => {
        let existingConversationId = await getConversationId();
        setConversationId(existingConversationId);
      })();
    } catch (error) {
      console.error('Error with fetching messages: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [participants, conversationId, getConversationId]);

  return {
    author,
    participants,
    conversationId,
    loading,
    addParticipant,
    removeParticipant,
    setParticipants,
    createConversationNode,
    createUserConversationNode,
    sendMessage,
    createConversationAndSendMessage,
  };
}
