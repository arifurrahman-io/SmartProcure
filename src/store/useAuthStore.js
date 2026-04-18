import { create } from "zustand";

import {
  loginUser,
  logoutUser,
  resetUserPassword,
  subscribeToAuthChanges,
} from "../services/auth/authService";
import {
  createUserProfile,
  getUserById,
} from "../services/firebase/userService";
import { getErrorMessage } from "../utils/errorHandler";
import { logError, logInfo } from "../utils/logger";

const isProfileDisabled = (profile) => {
  if (!profile) return false;

  return (
    profile.disabled === true ||
    String(profile.status || "").toLowerCase() === "disabled" ||
    String(profile.status || "").toLowerCase() === "deleted"
  );
};

const buildFallbackProfile = (firebaseUser) => ({
  id: firebaseUser.uid,
  uid: firebaseUser.uid,
  email: firebaseUser.email || "",
  name: firebaseUser.displayName || "User",
  role: "staff",
  status: "active",
  disabled: false,
});

const getOrCreateUserProfile = async (firebaseUser) => {
  const fetchedProfile = await getUserById(firebaseUser.uid);

  if (fetchedProfile) {
    return fetchedProfile;
  }

  const fallbackProfile = buildFallbackProfile(firebaseUser);
  await createUserProfile(firebaseUser.uid, fallbackProfile);

  return fallbackProfile;
};

const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  unsubscribeAuth: null,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),

  setAuthState: ({ user, profile }) =>
    set({
      user,
      profile,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }),

  clearAuth: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }),

  initializeAuth: () => {
    const existingUnsubscribe = get().unsubscribeAuth;
    if (existingUnsubscribe) return existingUnsubscribe;

    set({ isLoading: true, error: null });

    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          logInfo("Auth state changed: logged out");
          get().clearAuth();
          return;
        }

        logInfo("Auth state changed: logged in", firebaseUser.uid);

        const profile = await getOrCreateUserProfile(firebaseUser);

        if (isProfileDisabled(profile)) {
          logInfo("Blocked disabled user", firebaseUser.uid);

          try {
            await logoutUser();
          } catch (logoutError) {
            logError("Forced logout failed for disabled user:", logoutError);
          }

          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error:
              "Your account has been disabled. Please contact the administrator.",
          });

          return;
        }

        get().setAuthState({
          user: firebaseUser,
          profile,
        });
      } catch (error) {
        logError("initializeAuth error:", error);
        set({
          error: getErrorMessage(error),
          isLoading: false,
        });
        get().clearAuth();
      }
    });

    set({ unsubscribeAuth: unsubscribe });
    return unsubscribe;
  },

  disposeAuth: () => {
    const unsubscribe = get().unsubscribeAuth;
    if (unsubscribe) unsubscribe();
    set({ unsubscribeAuth: null });
  },

  login: async (credentials) => {
    set({ error: null });

    try {
      const user = await loginUser(credentials);

      const profile = await getOrCreateUserProfile(user);

      if (isProfileDisabled(profile)) {
        await logoutUser();

        const message =
          "Your account has been disabled. Please contact the administrator.";

        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          error: message,
        });

        throw new Error(message);
      }

      get().setAuthState({
        user,
        profile,
      });

      return user;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      await logoutUser();
      get().clearAuth();
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      await resetUserPassword(email);
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ error: message });
      throw error;
    }
  },
}));

export default useAuthStore;
