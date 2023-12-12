import { getDatabase, ref, onValue } from 'firebase/database';
import { getAllChannels } from '../../services/channel.service';
import { ChannelForm } from '../ChannelForm/ChannelForm';
import ChatForm from '../Ui/ChatForm';
import { useEffect, useState } from 'react';
import { getChannelMessages } from '../../services/message.service';
import { createChannel } from '../../services/channel.service';
import ChatList from './ChatList/ChatList';
import LoadingIndicator from '../Ui/LoadingIndicator';
import { useParams } from 'react-router-dom';
import TeamMembers from '../TeamForm/TeamForm';
import ImageWithLoading from '../helper/ImageWithLoading';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

export default function Chat() {
  const params = useParams();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isAddChannelFormVisible, setIsAddChannelFormVisible] = useState(false);
  const [selectedChannelMessages, setSelectedChannelMessages] = useState({});
  const { user } = useFirebaseAuth();

  const teamId = params.teamId;

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelData = await getAllChannels(teamId);
        setChannels(channelData);
      } catch (error) {
        console.error('Error fetching channels:', error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [teamId]);

  let offPreviousChannel;
  let offPreviousMessages;

  const selectChannel = (channel) => {
    offPreviousChannel && offPreviousChannel();

    setSelectedChannel(channel);

    if (offPreviousMessages) {
      offPreviousMessages();
    }

    const fetchMessages = async () => {
      try {
        await getChannelMessages(channel.id);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Handle the error appropriately
      }
    };

    setSelectedChannelMessages({});
    fetchMessages(channel);

    const dbMessagesRef = ref(
      getDatabase(),
      'channelMessages/' + channel.id + '/'
    );

    const offMessages = onValue(
      dbMessagesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSelectedChannelMessages(snapshot.val());
        }
      },
      (error) => {
        console.error('Error fetching profile: ', error);
      }
    );

    offPreviousMessages = () => {
      offMessages(dbMessagesRef);
    };
  };

  useEffect(() => {
    const dbRef = ref(getDatabase(), 'teamChannels/' + teamId + '/');

    onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const channelsObj = snapshot.val();
          const newChannels = Object.keys(channelsObj).map((key) => {
            return {
              ...channelsObj[key],
              id: key,
            };
          });

          setChannels(() => {
            return newChannels;
          });
        }
      },
      (error) => {
        console.error('Error fetching profile: ', error);
      }
    );
  }, [teamId]);

  const createChannelHandler = async (teamId, title, userId) => {
    const newChannel = await createChannel(teamId, title, userId);
    return newChannel;
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <div className="flex flex-row h-full w-full overflow-x-hidden pl-4">
          <div className="flex flex-col pb-8 pl-2 pr-2 bg-white flex-shrink-0 w-44">
            {/* ... Sidebar Content ... */}
            <div className="my-8">
              {/* ... Active Conversations ... */}
              <div className="text-sm">
                <div className="font-bold mb-4">Active channels</div>
                <ChatList
                  channels={channels}
                  onClick={(channel) => selectChannel(channel)}
                  selectedChannel={selectedChannel}
                />
                <div className="my-8">
                  {!isAddChannelFormVisible && (
                    <button
                      onClick={() => setIsAddChannelFormVisible(true)}
                      className="py-2 cursor-pointer text-gray-500  flex items-center gap-1"
                    >
                      <svg
                        className="h-4 w-4 text-blue-500"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <circle cx="12" cy="12" r="9" />
                        <line x1="9" y1="12" x2="15" y2="12" />
                        <line x1="12" y1="9" x2="12" y2="15" />
                      </svg>
                      Add channel
                    </button>
                  )}

                  {isAddChannelFormVisible && (
                    <div>
                      <div className="text-sm font-bold">Create a Channel</div>
                      <ChannelForm
                        onSubmit={createChannelHandler}
                        onCancel={() => setIsAddChannelFormVisible(false)}
                        teamId={teamId}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-auto h-full">
            {/* ... Chat Messages ... */}
            {!!selectedChannel && (
              <div className="flex flex-col h-full p-6 pr-0">
                <h1 className="text-xl font-semibold mb-6">
                  {selectedChannel.title}
                </h1>

                <div className="flex-1 relative overflow-auto mb-4">
                  <div className="absolute inset-0 pr-6">
                    <ul className="absolute flex flex-col gap-6 pb-8 pr-6 w-full">
                      {Object.keys(selectedChannelMessages || {}).map(
                        (messageKey, index) => {
                          const message = selectedChannelMessages[messageKey];

                          const classNames =
                            user.email === message.owner
                              ? ' flex-row-reverse pl-20'
                              : ' pr-20';

                          const bgClassNames =
                            user.email === message.owner
                              ? ' bg-sky-100'
                              : ' bg-emerald-100';

                          return (
                            <li
                              key={messageKey + index}
                              className={'flex gap-4' + classNames}
                            >
                              <div>
                                <ImageWithLoading
                                  className="mb-3 flex-shrink-0"
                                  src={''}
                                  alt="Some image"
                                  width="2rem"
                                  height="2rem"
                                />
                              </div>

                              <div
                                className={`flex flex-col gap-2 p-2 px-4 rounded-xl shadow-sm ${bgClassNames}`}
                              >
                                <div className="flex text-sm gap-2 items-center opacity-50">
                                  <div className="text-semibold">
                                    {message.owner}
                                  </div>
                                  <div className="opacity-50 text-xs">
                                    ({message.createdOn})
                                  </div>
                                </div>
                                <p className="text-m">{message.text}</p>
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col justify-end mt-auto pr-6">
                  <ChatForm selectedChannel={selectedChannel} />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col pb-8 pl-2 pr-2 w-56 bg-white flex-shrink-0">
            {!!selectedChannel && <TeamMembers teamId={teamId} />}
          </div>
        </div>
      )}
    </>
  );
}
