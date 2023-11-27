import { getDatabase, ref, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

/**
 * Sends a message to a specified channel in Firebase Realtime Database.
 *
 * @param {string} channelId - The ID of the channel to send the message to.
 * @param {string} text - The text of the message to send.
 * @returns {Promise<void>} A promise that resolves when the message is sent successfully.
 */
export const addMessageToChannel = async (channelId, text) => {
  const database = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const message = {
    uid: currentUser.uid,
    owner: currentUser.displayName || 'Anonymous', // Default to 'Anonymous' if displayName is not set
    text,
    createdOn: new Date().toISOString()
  };

  return push(ref(database, `channels/${channelId}/messages`), message);
};
