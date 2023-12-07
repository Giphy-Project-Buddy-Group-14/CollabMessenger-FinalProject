import { useState, useEffect, useRef } from 'react';
import UsersChatList from './UsersChatList';
import Split from 'react-split-grid';
import './Grid.css';
import PrivateMessageForm from './PrivateMessageForm';
import LoadingIndicator from '../../Ui/LoadingIndicator';
import MessagesPanel from './MessagesPanel';
import { toast } from 'react-toastify';
import useMessage from '../../../hooks/useMessage';
import useConversation from '../../../hooks/useConversation';

export default function PrivateMessages() {
  const [columns, setColumns] = useState('1fr 1px 4fr');
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    author,
    conversationId,
    loading,
    setParticipants,
    createConversationAndSendMessage,
  } = useConversation();

  const { sendMessage } = useMessage();

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
        await createConversationAndSendMessage(text);
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
    setParticipants([author, user]);
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
