import { get, ref, push, set } from 'firebase/database';
import { db } from '../../firebaseAppConfig';

/**
 * @typedef {Object} Channel
 * @property {string} owner - The owner of the channel.
 * @property {string} title - The title of the channel.
 * @property {string[]} participants - An array of user identifiers representing the participants in the channel.
 */

/**
 * Fetches all channels from the Firebase Realtime Database.
 * @returns {Promise<Channel[]>} A promise that resolves to an array of channel objects.
 */
export const getAllChannels = async (teamId) => {
  const channelsRef = ref(db, 'teamChannels/' + teamId + '/');

  try {
    const snapshot = await get(channelsRef);
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([key, value]) => ({
        id: key,
        ...value,
      }));
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

/**
 * Creates a new channel in Firebase Realtime Database.
 *
 * @param {string} uid - The unique identifier for the channel.
 * @param {string} owner - The owner of the channel.
 * @param {string} title - The title of the channel.
 * @returns {Promise<Channel>} A promise that resolves with the created channel object.
 * @throws {Error} If required information is missing or validation fails.
 */
export function createChannel(teamId, title, owner) {
  if (
    !title ||
    typeof title !== 'string' ||
    !owner ||
    typeof owner !== 'string'
  ) {
    throw new Error('Invalid or missing required channel information');
  }

  const newChannel = {
    title,
    owner,
    participants: [],
    messages: [],
  };

  const channelsRef = ref(db, 'teamChannels/' + teamId + '/');
  const newChannelRef = push(channelsRef);
  return set(newChannelRef, newChannel)
    .then(() => {
      const newChannelObj = { ...newChannel, id: newChannelRef.key }
      console.log('Channel created successfully: ', newChannelObj);
      return newChannelObj;
    })
    .catch((error) => {
      console.error('Error creating channel:', error);
      throw error;
    });
}
