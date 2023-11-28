import { getDatabase, ref, onValue, off } from 'firebase/database';
import { getAllChannels } from '../../services/channel.service';
import { ChannelForm } from '../ChannelForm/ChannelForm';
import ChatSection from '../Ui/ChatSection';
import { useEffect, useState } from 'react';

export default function Chat() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isAddChannelFormVisible, setIsAddChannelFormVisible] = useState(false);
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelData = await getAllChannels();
        setChannels(channelData);
      } catch (error) {
        console.error('Error fetching channels:', error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  let offPreviousChannel;

  const selectChannel = (channel) => {
    offPreviousChannel && offPreviousChannel();

    setSelectedChannel(channel);
  }

  if (loading) {
    return <div>Loading channels...</div>;
  }
  return (
    <>
      <div className="flex h-screen antialiased text-gray-800 overflow-y-hidden">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            {/* ... Sidebar Content ... */}
            <div className="my-8">
              {/* ... Active Conversations ... */}
              <div className="text-xs">
                <span className="font-bold">Active channels</span>
                <div>
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="cursor-pointer py-1 hover:text-cyan-500"
                      onClick={() => selectChannel(channel)}
                    >
                      {!!selectedChannel &&
                        selectedChannel.id === channel.id && <span>⭐️</span>}
                      {channel.title}
                    </div>
                  ))}
                </div>

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
                        onCancel={() => setIsAddChannelFormVisible(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
                {/* ... Active Conversations Buttons ... */}
              </div>

              <div className="flex flex-row items-center justify-between text-xs mt-6">
                <span className="font-bold">Users</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  7
                </span>
              </div>
              <div className="flex flex-col space-y-1 mt-4 -mx-2">
                {/* ... Archived Conversations Buttons ... */}
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
                    {Object.keys(selectedChannel.messages || {}).map(
                      (messageKey) => {
                        const message = selectedChannel.messages[messageKey];
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
                <ChatSection selectedChannel={selectedChannel} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
