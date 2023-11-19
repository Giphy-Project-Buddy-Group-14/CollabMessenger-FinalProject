import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebaseAppConfig';

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log('User signed up:', user);
    return user;
  } catch (error) {
    console.error('Sign in error:', error.message);
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log('User signIn:', user);
    return user;
  } catch (error) {
    console.error('Sign in error:', error.message);
    throw new Error(error.message);
  }
};

// export const logoutUser = () => {
//   return signOut(auth);
// };
