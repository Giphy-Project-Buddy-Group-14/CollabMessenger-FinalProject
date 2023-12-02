import { PropTypes } from 'prop-types';

export default function ChatPanel({ selectedChannel }) {
  return (
    <>
      <h1 className="text-xl font-semibold mb-6">{selectedChannel.title}</h1>
      <ul>
        {Object.keys(selectedChannel.messages || {}).map((messageKey) => {
          const message = selectedChannel.messages[messageKey];
          return (
            <li key={messageKey} className="mb-4">
              <div className="flex flex-row items-center justify-between">
                <div>
                  <p className="text-s font-semibold">{message.text}</p>
                  <div className="text-xs">{message.owner}</div>
                </div>
                <span className="text-xs text-gray-500">
                  {message.createdOn}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

ChatPanel.propTypes = {
  selectedChannel: PropTypes.object.isRequired,
};
