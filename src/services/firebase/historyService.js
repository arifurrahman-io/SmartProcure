import {
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import COLLECTIONS from "../../firebase/collections";

export const createHistoryRecord = async (payload) => {
  const ref = collection(db, COLLECTIONS.HISTORY);
  const result = await addDoc(ref, {
    ...payload,
    createdAt: new Date().toISOString(),
  });

  return result.id;
};

export const getAllHistory = async () => {
  const ref = collection(db, COLLECTIONS.HISTORY);
  const q = query(ref, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const getHistoryById = async (historyId) => {
  const ref = doc(db, COLLECTIONS.HISTORY, historyId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getHistoryByCampus = async (campus) => {
  const ref = collection(db, COLLECTIONS.HISTORY);
  const q = query(
    ref,
    where("campus", "==", campus),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};
