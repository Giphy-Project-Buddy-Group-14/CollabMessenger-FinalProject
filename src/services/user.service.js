import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../../firebaseAppConfig';

export const getUserByUsername = (username) => {
  return get(ref(db, `users/${username}`));
};

export const createUserUsername = (username, uid, email) => {
  return set(ref(db, `users/${username}`), {
    username,
    uid,
    email,
    createdOn: new Date(),
    updatedOn: new Date(),
  });
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};
