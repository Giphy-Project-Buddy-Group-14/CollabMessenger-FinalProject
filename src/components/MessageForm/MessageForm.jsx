import { useState } from 'react';
import PropTypes from 'prop-types';
import { addMessageToChannel } from '../../services/message.service';

function MessageForm({ channelId }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!text.trim()) {
      setError("Message cannot be empty");
      return;
    }

    try {
      await addMessageToChannel(channelId, text);
      console.log('Message sent successfully');
      setText(''); // Reset text field after successful send
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="messageText">Message:</label>
        <input
          type="text"
          id="messageText"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <button type="submit">Send Message</button>

      {error && <p>Error: {error}</p>}
    </form>
  );
}

MessageForm.propTypes = {
  channelId: PropTypes.string.isRequired,
};
export default MessageForm;