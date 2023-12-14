import { PropTypes } from 'prop-types';
import LoadingIndicator from '../Ui/LoadingIndicator';
import Heading from '../Ui/Heading';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getConversationById } from '../../services/conversation.service';
import { getUserProfileByUID } from '../../services/user.service';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import ImageWithLoading from '../helper/ImageWithLoading';
import useMessage from '../../hooks/useMessage';
import { toast } from 'react-toastify';

export default function ConversationPanel({ conversationId }) {
  const path = conversationId ? `privateMessages/${conversationId}` : null;
  const { user } = useFirebaseAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState([]);

  const { deleteMessage, author } = useMessage();

  const deleteMessageHandler = async (message) => {
    try {
      await deleteMessage(conversationId, message);
      toast.success('Successfully deleted message!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  const authorized = (message) => message.authorId === author.id;

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
                            {!loading && authorized(message) && (
                              <div
                                className="text-xs focus:outline-none focus:ring-0 hover:bg-sky-200 p-2 cursor-pointer rounded-xl"
                                onClick={() => deleteMessageHandler(message)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </div>
                            )}
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
