import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebaseAppConfig";

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed up:", user);
    return user;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email already in use");
    } else {
      throw new Error("Sign up error occurred...");
    }
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
    console.log("User signIn:", user);
    return user;
  } catch (error) {
    console.error("Sign in error:", error.message);
    throw new Error(error.message);
  }
};

// export const logoutUser = () => {
//   return signOut(auth);
// };

export const callSignOut = async () => {
  try {
    await signOut(auth);
    // Handle successful logout, e.g., redirect or update state
  } catch (error) {
    // Handle errors during sign out
    console.error("Error signing out", error);
  }
};
