import {
  get,
  set,
  remove,
  ref,
  push,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { db } from '../../firebaseAppConfig';

const currentTimestamp = (() => new Date().toISOString())();

export const generateParticipantsIdentifier = (participants) => {
  if (participants.length < 2) {
    throw new Error('At least two participants are required');
  }
  const sortedParticipantIds = participants
    .map((participant) => participant.id)
    .sort();

  return sortedParticipantIds.join('-');
};

export const findExistingConversationId = async (participants) => {
  if (participants.length < 2) {
    throw new Error('A conversation must include at least two participants');
  }

  const participantsKey = generateParticipantsIdentifier(participants);

  const snapshot = await get(
    query(
      ref(db, 'conversations'),
      orderByChild('participantsKey'),
      equalTo(participantsKey)
    )
  );

  let conversationId = null;

  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      conversationId = childSnapshot.key;
      return true;
    });
  }

  return conversationId;
};

const convertToParticipantsObject = (participants) => {
  const participantsObject = participants.reduce((obj, user) => {
    obj[user.id] = true;
    return obj;
  }, {});

  return participantsObject;
};

export const findUniqueParticipants = (participants) => {
  const uniqueParticipantIds = [];

  const uniqueParticipants = participants.filter((participant) => {
    if (!uniqueParticipantIds.includes(participant.id)) {
      uniqueParticipantIds.push(participant.id);
      return true;
    }
    return false;
  });

  return uniqueParticipants;
};

export const createConversationRecord = async (author, participants) => {
  try {
    const allParticipants = findUniqueParticipants([author, ...participants]);

    if (allParticipants.length < 2) {
      throw new Error('A conversation must include at least two participants');
    }

    let conversationId = await findExistingConversationId(allParticipants);

    if (conversationId) {
      throw new Error('Conversation already exists');
    }

    const participantsKey = generateParticipantsIdentifier(allParticipants);
    const participantsObject = convertToParticipantsObject(allParticipants);

    const snapshot = await push(ref(db, `conversations`), {
      author: author.id,
      createdAt: currentTimestamp,
      participants: participantsObject,
      participantsKey: participantsKey,
    });
    conversationId = snapshot.key;

    return conversationId;
  } catch (error) {
    console.error('Error on createConversation:', error);
    throw error;
  }
};

export const createUserConversationRecords = async (
  participants,
  conversationId
) => {
  participants.forEach(async (participant) => {
    await createUserConversationRecord(participant, conversationId);
  });
};

export const createUserConversationRecord = async (user, conversationId) => {
  try {
    const userConversationsRef = ref(
      db,
      `userConversations/${user.id}/${conversationId}`
    );
    await set(userConversationsRef, true);
  } catch (error) {
    console.error('Error updating userConversations:', error);
    throw error;
  }
};

export const createPrivateMessageRecord = async (
  conversationId,
  author,
  text
) => {
  try {
    const snapshot = await push(ref(db, `privateMessages/${conversationId}`), {
      authorId: author.id,
      text: text,
      createdAt: currentTimestamp,
    });

    return snapshot.key;
  } catch (error) {
    console.error('Error on createConversation:', error);
    throw error;
  }
};

export const deletePrivateMessageRecord = async (conversationId, messageId) => {
  try {
    await remove(ref(db, `privateMessages/${conversationId}/${messageId}`));
    console.log('Message deleted successfully');
  } catch (error) {
    console.error('Error on deletePrivateMessageRecord:', error);
    throw error;
  }
};

export const getConversationById = async (conversationId) => {
  try {
    const conversationRef = ref(db, `conversations/${conversationId}`);

    const snapshot = await get(conversationRef);

    if (snapshot.exists()) {
      return {
        id: snapshot.key,
        ...snapshot.val(),
      };
    } else {
      console.log('No conversation found with ID:', conversationId);
      return null;
    }
  } catch (error) {
    console.error('Error on getConversationById:', error);
    throw error;
  }
};

export const fetchUserConversationsById = async (userId) => {
  try {
    const userConversationsRef = ref(db, `userConversations/${userId}`);

    const snapshot = await get(userConversationsRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No user conversations found with user ID:', userId);
      return null;
    }
  } catch (error) {
    console.error('Error on fetchUserConversationsById:', error);
    throw error;
  }
};
