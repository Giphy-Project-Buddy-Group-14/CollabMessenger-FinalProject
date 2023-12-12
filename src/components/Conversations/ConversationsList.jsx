import LoadingIndicator from '../Ui/LoadingIndicator';
import Heading from '../Ui/Heading';
import { useParams } from 'react-router-dom';
import { useUserConversations } from '../../hooks/useUserConversations';
import ConversationItem from './ConversationItem';

export default function ConversationsList() {
  const { conversations, loading } = useUserConversations();
  const params = useParams();
  const conversationId = params.conversationId;

  const isSelected = (conversation) => {
    return conversationId === conversation.id;
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <Heading title="Private Conversations" />
          <div className="h-full px-2 pt-2 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul className="space-y-2 font-medium">
              {conversations.map((conversation) => {
                return (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={isSelected(conversation)}
                  />
                );
              })}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
