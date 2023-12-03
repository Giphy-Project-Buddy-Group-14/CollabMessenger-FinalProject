import PropTypes from 'prop-types';
import ChatItem from './ChatItem';

export default function ChatList({ channels, onClick, selectedChannel }) {
  const clickHandler = (channel) => {
    onClick(channel);
  };

  return (
    <>
      <div>
        {channels.map((channel) => (
          <ChatItem
            key={channel.id}
            channel={channel}
            onClick={clickHandler}
            selectedChannel={selectedChannel}
          />
        ))}
      </div>
    </>
  );
}

ChatList.propTypes = {
  channels: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  selectedChannel: PropTypes.object,
};
