import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
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
