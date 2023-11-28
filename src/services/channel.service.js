import { get, ref, push, set } from 'firebase/database';
import { db } from '../../firebaseAppConfig';
import { v4 as uuidv4 } from 'uuid';

/**
 * @typedef {Object} Channel
 * @property {string} uid - The unique user ID associated with the channel.
 * @property {string} owner - The owner of the channel.
 * @property {string} title - The title of the channel.
 * @property {string[]} participants - An array of user identifiers representing the participants in the channel.
 * @property {Message[]} messages - An array containing messages.
 */

/**
 * @typedef {Object} Message
 * @property {string} uid - The unique user ID associated with the message.
 * @property {string} owner - The owner of the message.
 * @property {string} createdAt - The creation timestamp of the message.
 * @property {string} text - The text content of the message.
 */

/**
 * Fetches all channels from the Firebase Realtime Database.
 * @returns {Promise<Channel[]>} A promise that resolves to an array of channel objects.
 */
export const getAllChannels = async () => {
  const channelsRef = ref(db, 'channels');
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
export function createChannel(title, owner) {
  const uid = uuidv4();

  if (
    !title ||
    typeof title !== 'string' ||
    !owner ||
    typeof owner !== 'string'
  ) {
    throw new Error('Invalid or missing required channel information');
  }

  const newChannel = {
    uid,
    title,
    owner,
    participants: [],
    messages: [],
  };

  const channelsRef = ref(db, 'channels');
  const newChannelRef = push(channelsRef);
  return set(newChannelRef, newChannel)
    .then(() => {
      console.log('Channel created successfully');
      return { ...newChannel, id: newChannelRef.key };
    })
    .catch((error) => {
      console.error('Error creating channel:', error);
      throw error;
    });
}
