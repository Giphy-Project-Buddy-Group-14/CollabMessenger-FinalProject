import ChatSection from '../Ui/ChatSection';
import { useState } from 'react';
import { createPrivateMessage } from '../../services/message.service';
export default function PrivateMessages() {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const messageData = {
        id: 'channelId',
        type: 'messageType',
        text: messageText,
      };

      await createPrivateMessage(messageData);

      setMessageText('');
    } catch (error) {
      console.error('Error sending private message:', error);
    }
  };

  return (
    <div className="flex flex-row h-full w-full overflow-x-hidden">
      <div className="flex flex-col pb-8 pl-2 pr-2 w-56 bg-white flex-shrink-0">
        {/* ... Sidebar Content ... */}
        <div className="my-8">
          {/* ... Active Conversations ... */}
          <div className="text-xs">
            <span className="font-bold">Group Messages</span>
            {/* <div>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="cursor-pointer py-1 hover:text-cyan-500"
                  onClick={() => selectChannel(channel)}
                >
                  {!!selectedChannel && selectedChannel.id === channel.id && (
                    <span>⭐️</span>
                  )}
                  {channel.title}
                </div>
              ))}
            </div> */}

            {/* <div className="my-8">
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
            </div> */}
          </div>

          <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto">
            {/* ... Active Conversations Buttons ... */}
          </div>

          <div className="flex flex-row items-center justify-between text-xs mt-6">
            <span className="font-bold">Direct Message</span>
            <span className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full">
              7
            </span>
          </div>
          <div className="flex flex-col space-y-1 mt-4 -mx-2">
            {/* ... Archived Conversations Buttons ... */}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-auto h-full">
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 p-4">
          {/* ... Chat Messages ... */}
          {/* {!!selectedChannel && (
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
          )} */}

          <div className="flex flex-col justify-end mt-auto">
            <ChatSection
              selectedChannel={handleSubmit}
              setMessageText={setMessageText} // Pass down a function to update messageText state
              messageText={messageText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
