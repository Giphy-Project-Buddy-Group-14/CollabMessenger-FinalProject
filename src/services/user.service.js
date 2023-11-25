import {
  get,
  set,
  ref,
  child,
  update,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import { db } from "../../firebaseAppConfig";
import { setFileToStorage } from "./storage.service";
import {
  limitToFirst,
  limitToLast,
  startAt,
  startAfter,
  endBefore,
  orderByKey,
} from "firebase/database";

export const createUser = (username, uid, email) => {
  return set(ref(db, `users/${username}`), {
    username,
    uid,
    email,
    firstName: "",
    lastName: "",
    phone: "",
    createdOn: Date.now(),
  });
};

export const getUserByUsername = (username) => {
  return get(ref(db, `users/${username}`));
};

function extractFirstKeyContent(data) {
  if (data && typeof data === "object") {
    const firstKey = Object.keys(data)[0];

    if (firstKey) {
      return data[firstKey];
    }
  }

  return null;
}

export const fetchUserProfile = async (uid) => {
  const queryRef = query(usersRef, orderByChild("uid"), equalTo(uid));

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
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const usersRef = ref(db, "users");

export const fetchTotalUserCount = async () => {
  try {
    const snapshot = await get(usersRef);
    const totalCount = snapshot?.size || 0;
    return totalCount;
  } catch (error) {
    console.log("fetchTotalUserCount error: ", error);
  }
};

export async function fetchUsersWithPagination(currentPage, itemsPerPage) {
  try {
    const endIndex = currentPage * itemsPerPage;
    // const startIndex = endIndex - itemsPerPage;

    const snapshot = await get(query(usersRef, limitToLast(endIndex)));

    if (!snapshot.exists()) {
      throw new Error("No data available");
    }

    const users = [];
    snapshot.forEach((childSnapshot) => {
      users.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    return users;
  } catch (error) {
    console.error("Error fetching users with pagination:", error);
    throw error;
  }
}

export const getUserData = async (uid) => {
  try {
    const userQuery = query(
      ref(db, "users"),
      orderByChild("uid"),
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
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const updateUser = async (username, content) => {
  try {
    if (!username) {
      throw new Error("Username is required for updates");
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
  const updateProfilePic = {};
  updateProfilePic[`/users/${username}/profilePictureURL`] = url;

  update(ref(db), updateProfilePic);
  return url;
};

export const checkIfUsernameExists = async (username) => {
  try {
    const snapshot = await get(child(usersRef, username));
    return snapshot.exists();
  } catch (error) {
    console.error("Error checking if  username exists:", error.message);
    throw new Error("Error checking if username exists");
  }
};
