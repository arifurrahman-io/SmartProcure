import { auth } from "../../firebase/config";

export const getCurrentUserSession = () => {
  return auth.currentUser || null;
};

export const getCurrentUserId = () => {
  return auth.currentUser?.uid || null;
};

export const isUserLoggedIn = () => {
  return !!auth.currentUser;
};
