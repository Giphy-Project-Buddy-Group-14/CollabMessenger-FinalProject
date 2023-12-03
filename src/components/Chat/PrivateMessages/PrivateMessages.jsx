import ChatForm from '../../Ui/ChatForm';
import { useState } from 'react';
import ChatPanel from '../ChatPanel/ChatPanel';

export default function PrivateMessages() {
  const [selectedChannel, setSelectedChannel] = useState(null);

  return (
    <>
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <div className="flex flex-col pb-8 pl-2 pr-2 w-56 bg-white flex-shrink-0">
          {/* ... Sidebar Content ... */}
          <div className="my-8">
            {/* ... Active Conversations ... */}
            <div className="text-xs">
              <span className="font-bold">Private Messages</span>{' '}
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-auto h-full p-6">
          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
            {/* ... Chat Messages ... */}
            {!!selectedChannel && (
              <ChatPanel selectedChannel={selectedChannel} />
            )}

            <div className="flex flex-col justify-end mt-auto">
              <ChatForm selectedChannel={selectedChannel} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
