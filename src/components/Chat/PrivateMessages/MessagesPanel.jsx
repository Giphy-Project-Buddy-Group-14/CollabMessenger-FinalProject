import { PropTypes } from 'prop-types';
import Message from './Message';

export default function MessagesPanel({ userProfiles, messages }) {
  const findUserProfileForMessage = (message) => {
    return userProfiles.find((profile) => profile.id === message.authorId);
  };

  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
      <div className="max-w-2xl mx-auto px-4">
        {messages.map((message) => {
          return (
            <Message
              key={message.id}
              userProfile={findUserProfileForMessage(message)}
              message={message}
            />
          );
        })}
      </div>
    </section>
  );
}

MessagesPanel.propTypes = {
  userProfiles: PropTypes.array.isRequired,
  messages: PropTypes.array.isRequired,
};
