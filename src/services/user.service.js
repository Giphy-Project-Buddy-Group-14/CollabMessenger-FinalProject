import {
  get,
  set,
  ref,
  child,
  update,
  query,
  equalTo,
  orderByChild,
} from 'firebase/database';
import { db } from '../../firebaseAppConfig';
import { setFileToStorage } from './storage.service';
import { limitToFirst, limitToLast, startAfter, endBefore } from 'firebase/database';

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

export const getUserByUsername = (username) => {
  return get(ref(db, `users/${username}`));
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

export const fetchUserProfile = async (uid) => {
  const usersRef = ref(db, 'users');
  const queryRef = query(usersRef, orderByChild('uid'), equalTo(uid));

  try {
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const user = extractFirstKeyContent(userData);
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};


export const fetchTotalUserCount = async () => {
  const usersRef = ref(db, 'users');
  const totalUsersSnapshot = await get(usersRef);

  if (totalUsersSnapshot.exists()) {
    const totalUserCount = totalUsersSnapshot.numChildren();
    return totalUserCount;
  } else {
    return 0;
  }
};


export const fetchUsersWithPagination = async (pageSize, username = null, pageDirection = 'next') => {
  const usersRef = ref(db, 'users');
  let queryRef;

  let orderByAsc
  // orderByAsc ? endBefore(username) : startAfter(username)
  if (pageDirection === 'next') {
    orderByAsc = false
  } else {
    orderByAsc = true
  }

  if (username) {
    queryRef = query(
      usersRef,
      orderByChild('username'),
      orderByAsc ? endBefore(username) : startAfter(username),
      limitToFirst(pageSize)
    );
  } else {
    queryRef = query(
      usersRef,
      orderByChild('username'),
      orderByAsc ? limitToLast(pageSize) : limitToFirst(pageSize)
    );
  }

  try {
    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      const usersList = Object.values(userData);
      return usersList;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
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
    const result = await fetchUserProfile(username);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const updateProfilePic = async (file, userData) => {
  const { username, uid } = userData;

  const url = await setFileToStorage(uid, file);
  console.log('url---> ', url);
  const updateProfilePic = {};
  updateProfilePic[`/users/${username}/profilePictureURL`] = url;

  update(ref(db), updateProfilePic);
  return url;
};

export const checkIfUsernameExists = async (username) => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(child(usersRef, username));
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking if  username exists:', error.message);
    throw new Error('Error checking if username exists');
  }
};




export const fromUsersDocument = (snapshot) => {
  const usersDocument = snapshot.val();

  return Object.keys(usersDocument).map((key) => {
    const user = usersDocument[key];
    return {
      ...user,
      username: key,
      createdOn: new Date(user.createdOn),
    };
  });
};

export const getAllUsers = async () => {
  try {
    const snapshot = await get(ref(db, "users"));

    if (!snapshot.exists()) {
      return [];
    }

    return fromUsersDocument(snapshot);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; 
  }
};

