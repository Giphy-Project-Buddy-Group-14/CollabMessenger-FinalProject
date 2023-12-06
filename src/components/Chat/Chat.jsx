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

export default function Chat() {
  const params = useParams();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isAddChannelFormVisible, setIsAddChannelFormVisible] = useState(false);
  const [selectedChannelMessages, setSelectedChannelMessages] = useState({});

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

    // const dbRef = ref(getDatabase(), 'channels/' + channel.id);

    // const off = onValue(
    //   dbRef,
    //   (snapshot) => {
    //     if (snapshot.exists()) {
    //       setSelectedChannel(() => {
    //         const newChannel = {
    //           ...snapshot.val(),
    //           id: snapshot.key,
    //         };

    //         return newChannel;
    //       });
    //     }
    //   },
    //   (error) => {
    //     console.error('Error fetching profile: ', error);
    //   }
    // );

    // offPreviousChannel = () => {
    //   off(dbRef);
    // };

    //
    // Fetch messages for the selected channel
    //

    if (offPreviousMessages) {
      offPreviousMessages();
    }

    const fetchMessages = async () => {
      try {
        const messages = await getChannelMessages(channel.id);
        setSelectedChannelMessages((prevChannel) => ({
          ...prevChannel,
          messages,
        }));
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
          setSelectedChannelMessages(() => {
            const newChannel = {
              ...snapshot.val(),
              id: snapshot.key,
            };
            return newChannel;
          });
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
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col pb-8 pl-2 pr-2 w-56 bg-white flex-shrink-0">
            {/* ... Sidebar Content ... */}
            <div className="my-8">
              {/* ... Active Conversations ... */}
              <div className="text-xs">
                <span className="font-bold">Active channels</span>{' '}
                <ChatList
                  channels={channels}
                  onClick={(channel) => selectChannel(channel)}
                  selectedChannel={selectedChannel}
                />
                <div className="my-8">
                  {!isAddChannelFormVisible && (
                    <button
                      onClick={() => setIsAddChannelFormVisible(true)}
                      className="py-2 cursor-pointer hover:text-cyan-500 opacity-50"
                    >
                      + add channel
                    </button>
                  )}
                  {isAddChannelFormVisible && (
                    <div>
                      <h3 className="text-xs font-bold">Create a Channel</h3>
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

          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              {/* ... Chat Messages ... */}
              {!!selectedChannel && (
                <div>
                  <h1 className="text-xl font-semibold mb-6">
                    {selectedChannel.title}
                  </h1>
                  <ul>
                    {Object.keys(selectedChannelMessages || {}).map(
                      (messageKey) => {
                        const message = selectedChannelMessages[messageKey];
                        return (
                          <li key={messageKey} className="mb-4">
                            <div className="flex flex-row items-center justify-between">
                              <div>
                                <p className="text-s font-semibold">
                                  {message.text}
                                </p>
                                <div className="text-xs">{message.owner}</div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {message.createdOn}
                              </span>
                            </div>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
              )}

              <div className="flex flex-col justify-end mt-auto">
                <ChatForm selectedChannel={selectedChannel} />
              </div>
            </div>
          </div>
          <div className="flex flex-col pb-8 pl-2 pr-2 w-56 bg-white flex-shrink-0">
            <TeamMembers teamId={teamId} />
          </div>
        </div>
      )}
    </>
  );
}
