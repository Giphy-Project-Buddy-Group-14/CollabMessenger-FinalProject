import { useContext } from 'react';

import { ConversationsContext } from '../context/ConversationsContext';

export const useUserConversations = () => {
  return useContext(ConversationsContext);
};
