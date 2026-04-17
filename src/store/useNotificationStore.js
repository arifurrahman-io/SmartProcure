import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  setNotifications: (notifications) => set({ notifications }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({
        ...item,
        isRead: true,
      })),
    })),

  clearNotificationState: () =>
    set({
      notifications: [],
      isLoading: false,
      error: null,
    }),
}));

export default useNotificationStore;
