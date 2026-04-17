import { useCallback, useEffect, useMemo } from "react";
import {
  getNotificationsByUser,
  markNotificationAsRead,
} from "../services/firebase/notificationService";
import useAuthStore from "../store/useAuthStore";
import useNotificationStore from "../store/useNotificationStore";

export default function useNotifications(autoLoad = true) {
  const {
    notifications,
    isLoading,
    error,
    setNotifications,
    setIsLoading,
    setError,
    markNotificationRead,
  } = useNotificationStore();

  const profile = useAuthStore((state) => state.profile);
  const userId = profile?.id || profile?.uid || null;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getNotificationsByUser(userId);
      setNotifications(data);
    } catch (err) {
      console.log("fetchNotifications error:", err);
      setError(err?.message || "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, [userId, setNotifications, setIsLoading, setError]);

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await markNotificationAsRead(notificationId);
        markNotificationRead(notificationId);
      } catch (err) {
        console.log("markAsRead error:", err);
        setError(err?.message || "Failed to update notification");
      }
    },
    [markNotificationRead, setError],
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  useEffect(() => {
    if (autoLoad) {
      fetchNotifications();
    }
  }, [autoLoad, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
  };
}
