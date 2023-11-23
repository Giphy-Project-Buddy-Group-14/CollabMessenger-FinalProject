import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseAppConfig";

export default function useFirebaseAuth() {
  const [user, loading, error] = useAuthState(auth);
  const isAuthenticated = !!user;

  return { user, loading, error, isAuthenticated };
}
