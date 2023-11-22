import { storage } from '../../firebaseAppConfig';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export const setFileToStorage = async (userId, file) => {
  try {
    const storageRef = ref(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    const snapshot = await uploadTask;

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
