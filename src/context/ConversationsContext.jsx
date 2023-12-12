import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';
import {
  fetchUserConversationsById,
  getConversationById,
} from '../services/conversation.service';
import { getUserProfileByUID } from '../services/user.service';

import { useAuth } from '../hooks/useAuth';

export const ConversationsContext = createContext();

export const ConversationsProvider = ({ children }) => {
  const { currentUserProfile } = useAuth();
  const [userConversations, setUserConversations] = useState({});
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserConversations = async (userProfile) => {
    if (!userProfile) {
      return;
    }

    try {
      setLoading(true);
      const fetchedUserConversations = await fetchUserConversationsById(
        userProfile.id
      );
      setUserConversations(fetchedUserConversations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async (userConversations) => {
    if (!userConversations) {
      return;
    }

    try {
      setLoading(true);
      const fetchedConversations = [];

      for (const conversationId of Object.keys(userConversations)) {
        const conversation = await getConversationById(conversationId);

        // Extract participant IDs and fetch their profiles
        const participantIds = Object.keys(conversation.participants);
        const participantProfiles = [];

        for (const participantId of participantIds) {
          const userProfile = await getUserProfileByUID(participantId);
          participantProfiles.push(userProfile);
        }

        // Update the conversation with participant profiles
        fetchedConversations.push({
          ...conversation,
          participants: participantProfiles,
        });
      }

      setConversations(fetchedConversations);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserConversations(currentUserProfile);
  }, [currentUserProfile]);

  useEffect(() => {
    loadConversations(userConversations);
  }, [userConversations]);

  return (
    <ConversationsContext.Provider
      value={{ conversations, userConversations, loading, error }}
    >
      {children}
    </ConversationsContext.Provider>
  );
};

ConversationsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
