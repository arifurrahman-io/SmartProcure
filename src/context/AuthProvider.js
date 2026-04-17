import { useEffect } from "react";
import { subscribeToAuthChanges } from "../services/auth/authService";
import { getUserById } from "../services/firebase/userService";
import useAuthStore from "../store/useAuthStore";
import { logError, logInfo } from "../utils/logger";

export default function AuthProvider({ children }) {
  const { setUser, setProfile, setIsAuthenticated, setIsLoading, clearAuth } =
    useAuthStore();

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          logInfo("Auth state changed: logged in", firebaseUser.uid);

          setUser(firebaseUser);
          setIsAuthenticated(true);

          const profile = await getUserById(firebaseUser.uid);
          setProfile(profile || null);
        } else {
          logInfo("Auth state changed: logged out");
          clearAuth();
        }
      } catch (error) {
        logError("AuthProvider error:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setProfile, setIsAuthenticated, setIsLoading, clearAuth]);

  return children;
}
