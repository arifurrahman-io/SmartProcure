import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase/config";

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const normalizePassword = (password = "") => String(password);

export const loginUser = async ({ email, password }) => {
  const safeEmail = normalizeEmail(email);
  const safePassword = normalizePassword(password);

  const result = await signInWithEmailAndPassword(
    auth,
    safeEmail,
    safePassword,
  );
  return result.user;
};

export const resetUserPassword = async (
  email,
  actionCodeSettings = undefined,
) => {
  const safeEmail = normalizeEmail(email);

  await sendPasswordResetEmail(auth, safeEmail, actionCodeSettings);
  return true;
};

export const logoutUser = async () => {
  await signOut(auth);
  return true;
};

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => {
  return auth.currentUser || null;
};

export const getCurrentUserId = () => {
  return auth.currentUser?.uid || null;
};

export const isUserLoggedIn = () => {
  return !!auth.currentUser;
};

export const isEmailVerified = () => {
  return !!auth.currentUser?.emailVerified;
};

export const sendCurrentUserVerificationEmail = async (
  actionCodeSettings = undefined,
) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found");
  }

  await sendEmailVerification(auth.currentUser, actionCodeSettings);
  return true;
};

export const updateCurrentUserProfile = async ({ displayName, photoURL }) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found");
  }

  await updateProfile(auth.currentUser, {
    ...(displayName !== undefined
      ? { displayName: String(displayName).trim() }
      : {}),
    ...(photoURL !== undefined ? { photoURL: String(photoURL).trim() } : {}),
  });

  return auth.currentUser;
};

export const updateCurrentUserPassword = async (newPassword) => {
  if (!auth.currentUser) {
    throw new Error("No authenticated user found");
  }

  const safePassword = normalizePassword(newPassword);

  await updatePassword(auth.currentUser, safePassword);
  return true;
};

export const reloadCurrentUser = async () => {
  if (!auth.currentUser) return null;

  await auth.currentUser.reload();
  return auth.currentUser;
};
