import {
  get,
  set,
  ref,
  update,
  query,
  equalTo,
  orderByChild,
} from 'firebase/database';
import { db } from '../../firebaseAppConfig';

export const getUserByUsername = (username) => {
  return get(ref(db, `users/${username}`));
};

export const createUser = (username, uid, email) => {
  return set(ref(db, `users/${username}`), {
    username,
    uid,
    email,
    createdOn: new Date(),
    updatedOn: new Date(),
  });
};

function extractFirstKeyContent(data) {
  if (data && typeof data === 'object') {
    const firstKey = Object.keys(data)[0];

    if (firstKey) {
      return data[firstKey];
    }
  }

  return null;
}

export const getUserById = async (id) => {
  try {
    const result = await get(
      ref(db, `users`),
      orderByChild('uid'),
      equalTo(id)
    );
    if (!result.exists()) {
      throw new Error(`User with id ${id} does not exist!`);
    }

    const user = extractFirstKeyContent(result.val());

    return user;
  } catch (error) {
    console.error(error);
  }
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const updateUser = async (id, content) => {
  try {
    const userRef = ref(db, `users/${id}`);
    await update(userRef, {
      ...content,
      updatedOn: Date.now(),
    });
    const result = await getUserById(id);
    return result;
  } catch (error) {
    console.error(error);
  }
};
