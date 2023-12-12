import ConversationPanel from './ConversationPanel';
import ConversationForm from './ConversationForm';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useMessage from '../../hooks/useMessage';

export default function Conversation() {
  const params = useParams();
  const conversationId = params.conversationId;

  const { sendMessage } = useMessage();

  const sendMessageHandler = async (text) => {
    if (!text.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      if (conversationId) {
        await sendMessage(conversationId, text);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <div className="overflow-y-auto grow">
        <ConversationPanel conversationId={conversationId} />
      </div>

      <div className="mt-auto">
        <ConversationForm key={conversationId} onSubmit={sendMessageHandler} />
      </div>
    </>
  );
}
