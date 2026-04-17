import { getItem, setItem, removeItem } from "./storageService";

const CACHE_KEYS = {
  USER_PROFILE: "cache_user_profile",
  DASHBOARD_SUMMARY: "cache_dashboard_summary",
  REQUESTS: "cache_requests",
  NOTIFICATIONS: "cache_notifications",
};

export const cacheData = async (key, data) => {
  await setItem(key, data);
  return true;
};

export const getCachedData = async (key) => {
  return await getItem(key);
};

export const clearCachedData = async (key) => {
  await removeItem(key);
  return true;
};

export { CACHE_KEYS };
