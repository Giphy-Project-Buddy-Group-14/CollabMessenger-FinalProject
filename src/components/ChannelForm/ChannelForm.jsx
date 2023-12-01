import { useState } from 'react';
import InputSection from '../Ui/InputSection';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import PropTypes from 'prop-types';

export function ChannelForm({ onSubmit, onCancel, teamId }) {
  const { user } = useFirebaseAuth();
  // State to store the form inputs
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state

    try {
      onSubmit(teamId, title, user.uid);
      setTitle('');
    } catch (err) {
      // Handle errors (e.g., validation errors)
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <InputSection
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder={'Channel Name'}
        />
      </div>

      <div className="gap-1 flex">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Create Channel
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">Error: {error}</p>}
    </form>
  );
}

ChannelForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  teamId: PropTypes.string,
};
