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
import { setFileToStorage } from './storage.service';

export const getUserByUsername = (username) => {
  return get(ref(db, `users/${username}`));
};

export const createUser = (username, uid, email) => {
  return set(ref(db, `users/${username}`), {
    username,
    uid,
    email,
    firstName: '',
    lastName: '',
    phone: '',
    createdOn: Date.now(),
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

export const getUserData = async (uid) => {
  try {
    const userQuery = query(
      ref(db, 'users'),
      orderByChild('uid'),
      equalTo(uid)
    );
    const userSnapshot = await get(userQuery);

    if (userSnapshot.exists()) {
      const user = extractFirstKeyContent(userSnapshot.val());
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const updateUser = async (username, content) => {
  try {
    if (!username) {
      throw new Error('Username is required for updates');
    }
    const userRef = ref(db, `users/${username}`);
    await update(userRef, {
      ...content,
      updatedOn: Date.now(),
    });
    const result = await getUserById(username);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const updateProfilePic = async (file, currentUser) => {
  const url = await setFileToStorage(file);

  const updateProfilePic = {};
  updateProfilePic[`/users/${currentUser}/profilePictureURL`] = url;

  update(ref(db), updateProfilePic);
  return url;
};
