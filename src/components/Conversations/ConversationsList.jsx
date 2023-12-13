import LoadingIndicator from '../Ui/LoadingIndicator';
import Heading from '../Ui/Heading';
import { useParams } from 'react-router-dom';
import { useUserConversations } from '../../hooks/useUserConversations';
import ConversationItem from './ConversationItem';
import { useNavigate } from 'react-router-dom';
import { CONVERSATION_PATH } from '../../common/routes';

export default function ConversationsList() {
  const navigate = useNavigate();
  const { conversations, loading } = useUserConversations();
  const params = useParams();
  const conversationId = params.conversationId;

  if (conversationId === undefined && conversations.length) {
    const path = CONVERSATION_PATH(conversations[0].id);
    navigate(path);
  }

  const isSelected = (conversation) => {
    return conversationId === conversation.id;
  };

  return (
    <div className="p-6">
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <Heading title="Private Conversations" />
          <div className="h-full overflow-y-auto bg-white dark:bg-gray-800">
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
    </div>
  );
}
