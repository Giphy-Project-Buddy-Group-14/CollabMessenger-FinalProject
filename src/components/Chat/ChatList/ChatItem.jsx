import PropTypes from 'prop-types';

export default function ChatItem({ channel, onClick, selectedChannel }) {
  const clickHandler = () => {
    onClick(channel);
  };

  return (
    <>
      <div
        key={channel.id}
        className="cursor-pointer py-1 hover:text-cyan-500"
        onClick={clickHandler}
      >
        {!!selectedChannel && selectedChannel.id === channel.id ? (
          <span className="text-cyan-600">#{channel.title}</span>
        ) : (
          `#${channel.title}`
        )}
      </div>
    </>
  );
}

ChatItem.propTypes = {
  channel: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  selectedChannel: PropTypes.object,
};
