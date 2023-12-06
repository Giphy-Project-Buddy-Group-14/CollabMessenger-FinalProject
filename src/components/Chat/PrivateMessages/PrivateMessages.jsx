import { useState, useEffect, useRef } from 'react';
import UsersChatList from './UsersChatList';
import Split from 'react-split-grid';
import './Grid.css';
import PrivateMessageForm from './PrivateMessageForm';
import LoadingIndicator from '../../Ui/LoadingIndicator';
import MessagesPanel from './MessagesPanel';
import { toast } from 'react-toastify';
import useSendMessage from '../../../hooks/useSendMessage';
import useUserConversation from '../../../hooks/useUserConversation';
import useConversation from '../../../hooks/useConversation';

export default function PrivateMessages() {
  const [columns, setColumns] = useState('1fr 1px 4fr');
  const [selectedUser, setSelectedUser] = useState(null);

  const { participants, conversationId, loading, createConversationNode } =
    useConversation(selectedUser);
  const { createUserConversationNode } = useUserConversation();
  const { sendMessage } = useSendMessage();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationId]);

  const onSubmitHandler = async (text) => {
    if (!text.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      if (conversationId) {
        await sendMessage(conversationId, text);
      } else {
        const newConversationId = await createConversationNode();
        await createUserConversationNode(newConversationId, participants);
        await sendMessage(newConversationId, text);
        toast.success('Successfully created a new conversation');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDrag = (direction, track, gridTemplateStyle) => {
    setColumns(gridTemplateStyle);
  };

  const onSelectUserHandler = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <Split
        gridTemplateColumns={columns}
        onDrag={handleDrag}
        cursor="col-resize"
        render={({ getGridProps, getGutterProps }) => (
          <div className="split-grid" {...getGridProps()}>
            <div className="split-column">
              <UsersChatList onSelectUser={onSelectUserHandler} />
            </div>
            <div
              className="split-column gutter gutter-vertical"
              {...getGutterProps('column', 1)}
            />
            <div className="flex flex-col">
              <div className="overflow-y-auto grow">
                {loading && <LoadingIndicator />}
                {!loading && (
                  <MessagesPanel
                    conversationId={conversationId}
                    messagesEndRef={messagesEndRef}
                  />
                )}
              </div>

              <div className="mt-auto">
                <PrivateMessageForm
                  user={selectedUser}
                  onSubmit={onSubmitHandler}
                />
              </div>
            </div>
          </div>
        )}
      />
    </>
  );
}
