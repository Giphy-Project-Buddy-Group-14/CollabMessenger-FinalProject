import {
  get,
  set,
  ref,
  push,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { db } from '../../firebaseAppConfig';

const currentTimestamp = (() => new Date().toISOString())();

export const generateParticipantsIdentifier = (participants) => {
  return participants.slice().sort().join('-');
};

export const findExistingConversationIdByParticipants = async (
  participants
) => {
  let existingConversationId = null;

  const participantsKey = generateParticipantsIdentifier(participants);
  const snapshot = await get(
    query(
      ref(db, 'conversations'),
      orderByChild('participantsKey'),
      equalTo(participantsKey)
    )
  );

  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      existingConversationId = childSnapshot.key;
      return true;
    });
  }

  return existingConversationId;
};

export const createConversation = async (author, participants, text) => {
  try {
    const participantsObject = participants.reduce((obj, userId) => {
      obj[userId] = true;
      return obj;
    }, {});

    let conversationId =
      await findExistingConversationIdByParticipants(participants);

    if (!conversationId) {
      const participantsKey = generateParticipantsIdentifier(participants);

      const result = await push(ref(db, `conversations`), {
        author: author.id,
        createdAt: currentTimestamp,
        participants: participantsObject,
        participantsKey: participantsKey,
      });
      conversationId = result.key;
    }

    participants.forEach(async (userId) => {
      await updateUserConversations(userId, conversationId);
    });

    const messageRef = await push(
      ref(db, `privateMessages/${conversationId}`),
      {
        authorId: author.id,
        text: text,
        createdAt: currentTimestamp,
      }
    );

    return messageRef.key;
  } catch (error) {
    console.error('Error on createConversation:', error);
    throw error;
  }
};

export const updateUserConversations = async (userId, conversationId) => {
  try {
    const userConversationsRef = ref(
      db,
      `userConversations/${userId}/${conversationId}`
    );
    await set(userConversationsRef, true);
  } catch (error) {
    console.error('Error updating userConversations:', error);
    throw error;
  }
};

export const addMessageToConversation = async (
  conversationId,
  author,
  text
) => {
  try {
    const messageRef = await push(
      ref(db, `privateMessages/${conversationId}`),
      {
        authorId: author.id,
        text: text,
        createdAt: currentTimestamp,
      }
    );

    return messageRef.key;
  } catch (error) {
    console.error('Error on createConversation:', error);
    throw error;
  }
};

export const getConversationById = async (conversationId) => {
  try {
    const conversationRef = ref(db, `conversations/${conversationId}`);

    const snapshot = await get(conversationRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No conversation found with ID:', conversationId);
      return null;
    }
  } catch (error) {
    console.error('Error on getConversationById:', error);
    throw error;
  }
};
