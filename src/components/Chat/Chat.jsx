import { getAllChannels } from '../../services/channel.service';
import { ChannelForm } from '../ChannelForm/ChannelForm';
import ChatSection from '../Ui/ChatSection';
import { useEffect, useState } from 'react';


export default function Chat() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelData = await getAllChannels();
        setChannels(channelData);
      } catch (error) {
        console.error("Error fetching channels:", error);
        // Handle the error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  if (loading) {
    return <div>Loading channels...</div>;
  }
  return (
    <>
      <div className="flex h-screen antialiased text-gray-800 overflow-y-hidden">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            {/* ... Sidebar Content ... */}
            <div className="flex flex-col mt-8">
              {/* ... Active Conversations ... */}
              <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Active Conversations</span>
                <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
                  4
                </span>
              </div>
              <div>
                <ChannelForm />
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
              {channels.map(channel => (
                <div key={channel.id} className="border p-4 rounded-lg shadow">
                  <h2 className="text-xl font-semibold">{channel.title}</h2>
                  <p>Participants: {channel.participants?.join(', ')}</p>
                  <div className="mt-2">
                    <strong>Messages:</strong>
                    <ul>
                      {channel.messages?.map((message, index) => (
                        <li key={index}>{message.text}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="flex flex-col justify-end mt-auto">
                <ChatSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
