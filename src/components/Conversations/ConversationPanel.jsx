import { PropTypes } from 'prop-types';
import LoadingIndicator from '../Ui/LoadingIndicator';
import Heading from '../Ui/Heading';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getConversationById } from '../../services/conversation.service';
import { getUserProfileByUID } from '../../services/user.service';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import ImageWithLoading from '../helper/ImageWithLoading';

export default function ConversationPanel({ conversationId }) {
  const path = conversationId ? `privateMessages/${conversationId}` : null;
  const { user } = useFirebaseAuth();

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
    <div className="flex flex-1">
      {loading && <LoadingIndicator />}
      {!loading && (
        <div className="flex-1 flex flex-col">
          {messages.length === 0 && (
            <div className="h-16 flex items-center pl-6 pt-6">
              <Heading title="Start a new conversation" />
            </div>
          )}

          {messages.length !== 0 && (
            <div className="h-16 flex items-center pl-6 pt-6">
              <Heading title="You are currently in an active conversation..." />
            </div>
          )}

          {messages.length !== 0 && (
            <div className="flex-1 relative overflow-auto">
              <div className="absolute inset-0 p-6">
                <ul className="flex flex-col gap-6 pb-8 pr-6 w-full">
                  {Object.keys(messages || {}).map((messageKey, index) => {
                    const message = messages[messageKey];
                    const userProfile = findUserProfileForMessage(message);

                    console.log('userProfile', userProfile);

                    const options = {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    };

                    const classNames =
                      user.uid === message.authorId
                        ? ' flex-row-reverse pl-20'
                        : ' pr-20';

                    const bgClassNames =
                      user?.uid === message.authorId
                        ? ' bg-sky-100'
                        : ' bg-emerald-100';

                    return (
                      <li
                        key={messageKey + index}
                        className={'flex gap-4' + classNames}
                      >
                        <div>
                          {userProfile && (
                            <ImageWithLoading
                              className="mb-3 flex-shrink-0 rounded-full"
                              src={userProfile.profilePictureURL}
                              alt="Some image"
                              width="2rem"
                              height="2rem"
                            />
                          )}
                        </div>

                        <div
                          className={`flex flex-col gap-2 p-2 px-4 rounded-xl shadow-sm ${bgClassNames}`}
                        >
                          <div className="flex text-sm gap-4 items-center opacity-50">
                            <div className="text-semibold">
                              {userProfile?.firstName +
                                ' ' +
                                userProfile?.lastName || userProfile.owner}
                            </div>
                            <div className="opacity-50 text-xs">
                              {new Date(message.createdAt).toLocaleString(
                                'en-us',
                                options
                              )}
                            </div>
                          </div>
                          <p className="text-m">{message.text}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}

          {/* {messages.length !== 0 && (
            <div className="flex-1 relative overflow-auto">
              <section className="p-6 absolute">
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
              </section>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}

ConversationPanel.propTypes = {
  conversationId: PropTypes.string,
};
