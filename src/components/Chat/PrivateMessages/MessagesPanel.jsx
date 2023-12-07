import { PropTypes } from 'prop-types';
import Message from './Message';
import LoadingIndicator from '../../Ui/LoadingIndicator';
import useLoadConversation from '../../../hooks/useLoadConversation';
import Heading from '../../Ui/Heading';

export default function MessagesPanel({ conversationId, messagesEndRef }) {
  const { messages, userProfiles, loading } =
    useLoadConversation(conversationId);

  const findUserProfileForMessage = (message) => {
    return userProfiles.find((profile) => profile.id === message.authorId);
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          {messages.length === 0 && (
            <Heading title="Start a new conversation" />
          )}
          {messages.length !== 0 && (
            <>
              <Heading title="You are currently in an active conversation..." />
              <section className="dark:bg-gray-900 py-1 lg:py-1 antialiased">
                <div className="px-4">
                  {messages.map((message) => {
                    const userProfile = findUserProfileForMessage(message);
                    if (!userProfile) return;

                    return (
                      <Message
                        key={message.id}
                        userProfile={userProfile}
                        message={message}
                        conversationId={conversationId}
                      />
                    );
                  })}
                  {/* Attach the ref to an element at the bottom of your messages */}
                  <div ref={messagesEndRef} />
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}

MessagesPanel.propTypes = {
  conversationId: PropTypes.string,
  messagesEndRef: PropTypes.object,
};
