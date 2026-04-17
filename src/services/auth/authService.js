import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/config";

export const loginUser = async ({ email, password }) => {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  return result.user;
};

export const resetUserPassword = async (email) => {
  await sendPasswordResetEmail(auth, email.trim());
  return true;
};

export const logoutUser = async () => {
  await signOut(auth);
  return true;
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
