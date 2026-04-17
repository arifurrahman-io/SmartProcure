import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),

  clearAuth: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

export default useAuthStore;
