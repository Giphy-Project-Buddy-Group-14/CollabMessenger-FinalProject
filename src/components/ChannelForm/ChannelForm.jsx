import { useState } from 'react';
import { createChannel } from '../../services/channel.service';
import InputSection from '../Ui/InputSection';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

export function ChannelForm() {
  const { user } = useFirebaseAuth();
  // State to store the form inputs
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state

    try {
      // Call createChannel service function with the form inputs
      const newChannel = await createChannel(title, user.uid);
      console.log('Channel Created:', newChannel);

      // Reset form fields after successful creation
      setTitle('');
    } catch (err) {
      // Handle errors (e.g., validation errors)
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <InputSection
          onChange={(e) => setTitle(e.target.value)}
          label="Title"
          type="text"
        />
      </div>
      <button type="submit">Create Channel</button>

      {error && <p>Error: {error}</p>}
    </form>
  );
}


