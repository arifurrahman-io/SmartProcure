import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import COLLECTIONS from "../../firebase/collections";

export const createRequest = async (payload) => {
  const ref = collection(db, COLLECTIONS.REQUESTS);
  const result = await addDoc(ref, {
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return result.id;
};

export const getAllRequests = async () => {
  const ref = collection(db, COLLECTIONS.REQUESTS);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const getRequestById = async (requestId) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getRequestsByUser = async (userId) => {
  const ref = collection(db, COLLECTIONS.REQUESTS);
  const q = query(
    ref,
    where("authorId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const updateRequest = async (requestId, updates) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return true;
};

export const deleteRequest = async (requestId) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);
  await deleteDoc(ref);
  return true;
};
