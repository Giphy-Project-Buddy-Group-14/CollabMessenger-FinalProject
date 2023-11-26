import {
  ref,
  push,
  get,
  remove,
  query,
  equalTo,
  orderByChild,
  update,
} from 'firebase/database';
import { db } from '../../firebaseAppConfig';

const fromMessageDocument = async (snapshot) => {
  try {
    const messagesDocument = snapshot.val();

    return Object.keys(messagesDocument).map((key) => {
      const message = messagesDocument[key];

      return {
        ...message,
        id: key,
        createdOn: new Date(message.createdOn),
        likedBy: message.likedBy ? Object.keys(message.likedBy) : [],
      };
    });
  } catch (error) {
    console.error(error);
  }
};

export const createMessage = async (userId, contentObject) => {
  try {
    const result = await push(ref(db, 'messages'), {
      ...contentObject,
      userId: userId,
      createdOn: Date.now(),
    });

    return getMessageById(result.key);
  } catch (error) {
    console.error(error);
  }
};

export const updateMessage = async (id, content) => {
  try {
    const messageRef = ref(db, `messages/${id}`);
    await update(messageRef, {
      content: content,
      updatedOn: Date.now(),
    });
    const result = await getMessageById(id);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getMessageById = async (id) => {
  try {
    const result = await get(ref(db, `messages/${id}`));

    if (!result.exists()) {
      throw new Error(`Message with id ${id} does not exist!`);
    }

    const message = result.val();
    message.id = id;
    message.createdOn = new Date(message.createdOn);
    if (!message.likedBy) message.likedBy = [];

    return message;
  } catch (error) {
    console.error(error);
  }
};

export const getMessagesByMessageId = async (messageId) => {
  try {
    const snapshot = await get(
      query(ref(db, 'messages'), orderByChild('messageId'), equalTo(messageId))
    );

    if (!snapshot.exists()) {
      return [];
    }

    return fromMessageDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
};

export const deleteMessageById = async (id) => {
  try {
    await remove(ref(db, `messages/${id}`));
  } catch (error) {
    console.error(error);
  }
};
