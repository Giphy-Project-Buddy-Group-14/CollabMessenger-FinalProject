import {
  get,
  set,
  ref,
  child,
  update,
  query,
  limitToFirst,
} from 'firebase/database';
import { db, auth } from '../../firebaseAppConfig';
import { setFileToStorage } from './storage.service';
import { DEFAULT_TIME_ZONE } from '../common/constants';
import moment from 'moment-timezone';

export const usersRef = ref(db, 'users');
export const userRef = (uid) => ref(db, `users/${uid}`);

export const createUserProfile = (userData) => {
  try {
    const { currentUser } = auth;

    if (!currentUser) {
      throw new Error('User not authenticated.');
    }

    const { uid } = currentUser;

    if (!userData || !userData.uid) {
      throw new Error('Invalid user data');
    }

    if (userData.uid !== uid) {
      throw new Error('User UID must match the authenticated user UID');
    }

    const mergedUserData = {
      firstName: '',
      lastName: '',
      phone: '',
      profilePictureURL: '',
      createdOn: Date.now(),
      ...userData,
    };

    const userUidRef = ref(db, `users/${uid}`);
    return set(userUidRef, mergedUserData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const getUserProfileByUID = async (uid) => {
  try {
    const snapshot = await get(userRef(uid));

    if (snapshot.exists()) {
      const userProfile = snapshot.val();
      return {
        ...userProfile,
        displayName: displayName(userProfile),
        id: uid,
        uid,
      };
    } else {
      throw new Error('User not found.');
    }
  } catch (error) {
    console.error('Error fetching user profile data:', error);
    throw error;
  }
};

export const fetchTotalUserCount = async () => {
  try {
    const snapshot = await get(usersRef);
    const totalCount = snapshot?.size || 0;
    return totalCount;
  } catch (error) {
    console.log('fetchTotalUserCount error: ', error);
  }
};

const convertCreatedOn = (users) => {
  return users.map((user) => ({
    ...user,
    createdOn: formatCreatedOn(user),
  }));
};

export async function fetchUsersWithPagination(currentPage, usersPerPage) {
  try {
    const endIndex = currentPage * usersPerPage;
    const startIndex = (currentPage - 1) * usersPerPage;

    const snapshot = await get(query(usersRef, limitToFirst(endIndex)));

    if (!snapshot.exists()) {
      throw new Error('No data available');
    }

    const users = [];
    snapshot.forEach((childSnapshot) => {
      users.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    const usersList = convertCreatedOn(users);
    return usersList.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error fetching users with pagination:', error);
    throw error;
  }
}

export const updateUserProfile = async (uid, userData) => {
  try {
    if (!uid) {
      throw new Error('User UID is required for updates');
    }
    await update(userRef(uid), {
      ...userData,
      updatedOn: Date.now(),
    });
    const profile = await getUserProfileByUID(uid);
    return profile;
  } catch (error) {
    console.error(error);
  }
};

export const updateUserProfilePic = async (file, userData) => {
  const { uid } = userData;

  const url = await setFileToStorage(uid, file);
  const updateProfilePic = {};
  updateProfilePic[`/users/${uid}/profilePictureURL`] = url;

  update(ref(db), updateProfilePic);
  return url;
};

export const checkIfUsernameExists = async (username) => {
  try {
    const snapshot = await get(child(usersRef, username));
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking if  username exists:', error.message);
    throw new Error('Error checking if username exists');
  }
};

const formatCreatedOn = (user) => {
  return user?.createdOn
    ? moment(user.createdOn)
      .tz(DEFAULT_TIME_ZONE)
      .format('MMM Do YYYY, h:mm:ss A')
    : '';
};

export const fromUsersDocument = (snapshot) => {
  const userProfiles = snapshot.val();

  return Object.keys(userProfiles).map((uid) => {
    const userProfile = userProfiles[uid];

    const createdOn = formatCreatedOn(userProfile);

    return {
      ...userProfile,
      displayName: displayName(userProfile),
      id: uid,
      uid,
      createdOn,
    };
  });
};

export const getAllUserProfiles = async () => {
  try {
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const userProfiles = fromUsersDocument(snapshot);
      return userProfiles;
    } else {
      throw new Error('Snapshot data does not exist.');
    }
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

const displayName = (userProfile) => {
  if (!userProfile.firstName || !userProfile.lastName)
    return userProfile.username;

  return `${userProfile.firstName} ${userProfile.lastName}`;
};
