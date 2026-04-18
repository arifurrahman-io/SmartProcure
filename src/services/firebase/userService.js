import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase/config";
import COLLECTIONS from "../../firebase/collections";

export const getUserById = async (userId) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const createUserProfile = async (userId, userData) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);

  await setDoc(ref, {
    ...userData,
    createdAt: new Date().toISOString(),
  });

  return true;
};

export const updateUserProfile = async (userId, updates) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);

  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  return true;
};

export const getAllUsers = async () => {
  const ref = collection(db, COLLECTIONS.USERS);
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};

export const getUsersByRole = async (role) => {
  const ref = collection(db, COLLECTIONS.USERS);
  const q = query(ref, where("role", "==", role));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
};

export const setUserRole = async (userId, role, changedBy = null) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);

  await updateDoc(ref, {
    role,
    updatedAt: new Date().toISOString(),
    roleUpdatedAt: new Date().toISOString(),
    roleUpdatedBy: changedBy || null,
  });

  return true;
};

export const enableUser = async (userId, changedBy = null) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);

  await updateDoc(ref, {
    status: "active",
    disabled: false,
    updatedAt: new Date().toISOString(),
    statusUpdatedAt: new Date().toISOString(),
    statusUpdatedBy: changedBy || null,
  });

  return true;
};

export const disableUser = async (userId, changedBy = null) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);

  await updateDoc(ref, {
    status: "disabled",
    disabled: true,
    updatedAt: new Date().toISOString(),
    statusUpdatedAt: new Date().toISOString(),
    statusUpdatedBy: changedBy || null,
  });

  return true;
};

// Optional soft delete for app-level removal
export const softDeleteUserProfile = async (userId, changedBy = null) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);

  await updateDoc(ref, {
    status: "deleted",
    disabled: true,
    deletedAt: new Date().toISOString(),
    deletedBy: changedBy || null,
    updatedAt: new Date().toISOString(),
  });

  return true;
};

// Only use this if you really want to remove the Firestore profile document.
// This does NOT delete Firebase Auth account.
export const deleteUserProfileDocument = async (userId) => {
  const ref = doc(db, COLLECTIONS.USERS, userId);
  await deleteDoc(ref);
  return true;
};
