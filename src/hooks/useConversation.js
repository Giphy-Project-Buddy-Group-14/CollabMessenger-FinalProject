import { useEffect, useState, useCallback } from 'react';
import { findExistingConversationId } from '../services/conversation.service';
import { createConversationRecord } from '../services/conversation.service';
import useParticipants from './useParticipants';

export default function useConversation(user) {
  const { author, participants } = useParticipants(user);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

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

  useEffect(() => {
    if (!user) {
      setConversationId(null);
      setLoading(false);
      return;
    }

    if (participants.length < 2) {
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
  }, [participants, conversationId, user, getConversationId]);

  return {
    author,
    participants,
    conversationId,
    loading,
    createConversationNode,
  };
}
