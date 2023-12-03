import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../../../../firebaseAppConfig';
import {
  createConversation,
  findExistingConversationIdByParticipants,
  addMessageToConversation,
  getConversationById,
} from '../../../services/conversation.service';
import { useUserProfile } from '../../../hooks/useUserProfile';
import LoadingIndicator from '../../Ui/LoadingIndicator';
import MessagesPanel from './MessagesPanel';
import { getUserProfileByUID } from '../../../services/user.service';

export default function PrivateMessageForm({ user }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);

  const { userProfile: author } = useUserProfile();

  useEffect(() => {
    (async () => {
      if (user) {
        const participants = [author.id, user.id];
        const existingConversationId =
          await findExistingConversationIdByParticipants(participants);
        setConversationId(existingConversationId);
      }
    })();
  }, [author, user]);

  useEffect(() => {
    try {
      if (conversationId) {
        setLoadingMessages(true);

        (async () => {
          const conversationData = await getConversationById(conversationId);
          const fetchedUserProfiles = [];
          for (const participantId in conversationData.participants) {
            const profile = await getUserProfileByUID(participantId);
            fetchedUserProfiles.push(profile);
          }
          setUserProfiles(fetchedUserProfiles);
        })();
      } else {
        setUserProfiles([]);
      }
    } catch (error) {
      console.error('Error with fetching messages: ', error);
      throw error;
    } finally {
      setLoadingMessages(false);
    }
  }, [user, conversationId]);

  useEffect(() => {
    try {
      if (conversationId) {
        setLoadingMessages(true);
        const messagesRef = ref(db, `privateMessages/${conversationId}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
          if (snapshot.exists()) {
            const fetchedMessages = [];
            snapshot.forEach((childSnapshot) => {
              fetchedMessages.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });
            setMessages(fetchedMessages);
          } else {
            setMessages([]);
          }
        });

        return () => off(messagesRef, 'value', unsubscribe);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error with fetching messages: ', error);
      throw error;
    } finally {
      setLoadingMessages(false);
    }
  }, [user, conversationId]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    setError(null);

    if (!text.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      if (conversationId) {
        await addMessageToConversation(conversationId, author, text);
      } else {
        const participants = [author.id, user.id];
        await createConversation(author, participants, text);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setText(''); // Reset text field after successful send
    }
  };

  return (
    <>
      <div>
        {loadingMessages && <LoadingIndicator />}
        {!loadingMessages && (
          <MessagesPanel userProfiles={userProfiles} messages={messages} />
        )}
      </div>

      <form onSubmit={onSubmitHandler}>
        <label htmlFor="chat" className="sr-only">
          Your message
        </label>
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
          <button
            type="button"
            className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 18"
            >
              <path
                fill="currentColor"
                d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
              />
            </svg>
            <span className="sr-only">Upload image</span>
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
              />
            </svg>
            <span className="sr-only">Add emoji</span>
          </button>
          <input
            disabled={!user}
            id="chat"
            rows="1"
            className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your message..."
            onChange={(e) => setText(e.target.value)}
            value={text}
          />

          {error && <div className="bg-red-500 mt-2">Error: {error}</div>}

          <button
            type="submit"
            className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          >
            <svg
              className="w-5 h-5 rotate-90 rtl:-rotate-90"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </>
  );
}

PrivateMessageForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};
