import { PropTypes } from 'prop-types';
import ConversationMessage from './ConversationMessage';
import LoadingIndicator from '../Ui/LoadingIndicator';
import Heading from '../Ui/Heading';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getConversationById } from '../../services/conversation.service';
import { getUserProfileByUID } from '../../services/user.service';

export default function ConversationPanel({ conversationId }) {
  const path = conversationId ? `privateMessages/${conversationId}` : null;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    if (!path) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const dbRef = ref(getDatabase(), path);

    onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          let realtimeData = snapshot.val();

          if (
            realtimeData &&
            typeof realtimeData === 'object' &&
            !Array.isArray(realtimeData)
          ) {
            realtimeData = Object.keys(realtimeData).map((key) => ({
              id: key,
              ...realtimeData[key],
            }));
          }

          setMessages(realtimeData);
          setLoading(false);
        } else {
          setMessages([]);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error fetching profile: ', error);
        setLoading(false);
      }
    );

    return () => off(dbRef);
  }, [path]);

  useEffect(() => {
    if (!conversationId) {
      setUserProfiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      (async () => {
        const conversationData = await getConversationById(conversationId);
        const fetchedUserProfiles = [];
        for (const participantId in conversationData.participants) {
          const profile = await getUserProfileByUID(participantId);
          fetchedUserProfiles.push(profile);
        }
        setUserProfiles(fetchedUserProfiles);
      })();
    } catch (error) {
      console.error('Error with fetching messages: ', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

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
                      <ConversationMessage
                        key={message.id}
                        userProfile={userProfile}
                        message={message}
                        conversationId={conversationId}
                      />
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}

ConversationPanel.propTypes = {
  conversationId: PropTypes.string,
};
