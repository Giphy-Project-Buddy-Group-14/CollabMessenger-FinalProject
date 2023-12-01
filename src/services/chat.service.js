import { get, ref, push, set } from 'firebase/database';
import { db } from '../../firebaseAppConfig';

export const addUserToChat = async (userId, chatId) => {
  const result = await push(ref(db, 'userchats'), {});
  // const userChatKey = db.ref().child('userchats').push().key;
  const userChatKey = result.key;

  const updates = {};
  updates['/userchats/' + userChatKey] = { userId, chatId };

  return db.ref().update(updates);
};

// export function createConversation(owner) {
//   if (
//     !title ||
//     typeof title !== 'string' ||
//     !owner ||
//     typeof owner !== 'string'
//   ) {
//     throw new Error('Invalid or missing required channel information');
//   }

//   const newChannel = {
//     title,
//     owner,
//     participants: [],
//     messages: [],
//   };

//   const conversationRef = ref(db, 'conversations');
//   const newChannelRef = push(conversationRef);

//   return set(newChannelRef, newChannel)
//     .then(() => {
//       console.log('Channel created successfully');
//       return { ...newChannel, id: newChannelRef.key };
//     })
//     .catch((error) => {
//       console.error('Error creating channel:', error);
//       throw error;
//     });
// }

// export const getAllChannels = async () => {
//   const channelsRef = ref(db, 'channels');
//   try {
//     const snapshot = await get(channelsRef);
//     if (snapshot.exists()) {
//       return Object.entries(snapshot.val()).map(([key, value]) => ({
//         id: key,
//         ...value,
//       }));
//     } else {
//       console.log('No data available');
//       return [];
//     }
//   } catch (error) {
//     console.error('Error fetching channels:', error);
//     throw error;
//   }
// };
