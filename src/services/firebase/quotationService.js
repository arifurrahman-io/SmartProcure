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
} from "firebase/firestore";
import { db } from "../../firebase/config";
import COLLECTIONS from "../../firebase/collections";

export const createQuotation = async (payload) => {
  const ref = collection(db, COLLECTIONS.QUOTATIONS);
  const result = await addDoc(ref, {
    ...payload,
    isApproved: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return result.id;
};

export const getQuotationById = async (quotationId) => {
  const ref = doc(db, COLLECTIONS.QUOTATIONS, quotationId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const getQuotationsByRequest = async (requestId) => {
  const ref = collection(db, COLLECTIONS.QUOTATIONS);
  const q = query(ref, where("requestId", "==", requestId));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data(),
    }))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
};

export const getQuotationCountByRequest = async (requestId) => {
  const ref = collection(db, COLLECTIONS.QUOTATIONS);
  const q = query(ref, where("requestId", "==", requestId));
  const snapshot = await getDocs(q);

  return snapshot.size;
};

export const updateQuotation = async (quotationId, updates) => {
  const ref = doc(db, COLLECTIONS.QUOTATIONS, quotationId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  return true;
};

export const approveQuotation = async (quotationId, approvedBy) => {
  const ref = doc(db, COLLECTIONS.QUOTATIONS, quotationId);
  await updateDoc(ref, {
    isApproved: true,
    approvedBy,
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return true;
};

export const deleteQuotation = async (quotationId) => {
  const ref = doc(db, COLLECTIONS.QUOTATIONS, quotationId);
  await deleteDoc(ref);
  return true;
};
