import { getDatabase, ref, push, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseAppConfig';

export const addMessageToChannel = async ({
  channelId,
  text,
  profilePictureURL,
  ownerName,
}) => {
  const database = getDatabase();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const message = {
    uid: currentUser.uid,
    owner: currentUser.email || 'unknown', // Default to 'Anonymous' if displayName is not set
    text,
    profilePictureURL,
    ownerName,
    createdOn: new Date().toISOString(),
  };

  return push(ref(database, `channelMessages/${channelId}/`), message);
};

export const getChannelMessages = async (channelId) => {
  const channelsRef = ref(db, 'channelMessages/' + channelId + '/');
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
