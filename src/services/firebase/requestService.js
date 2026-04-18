import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import COLLECTIONS from "../../firebase/collections";

const requestsRef = collection(db, COLLECTIONS.REQUESTS);

const mapSnapshotDoc = (snapshot) => ({
  id: snapshot.id,
  ...snapshot.data(),
});

const buildRequestsQuery = (filters = {}) => {
  const constraints = [];

  if (filters.authorId) {
    constraints.push(where("authorId", "==", filters.authorId));
  }

  if (filters.campus) {
    constraints.push(where("campus", "==", filters.campus));
  }

  if (filters.status) {
    constraints.push(where("status", "==", filters.status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  return query(requestsRef, ...constraints);
};

export const createRequest = async (payload) => {
  const result = await addDoc(requestsRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return result.id;
};

export const getAllRequests = async (filters = {}) => {
  const q = buildRequestsQuery(filters);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(mapSnapshotDoc);
};

export const getRequestById = async (requestId) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return mapSnapshotDoc(snapshot);
};

export const getRequestsByUser = async (userId) => {
  return getAllRequests({ authorId: userId });
};

export const subscribeToAllRequests = (callback, filters = {}, onError) => {
  const q = buildRequestsQuery(filters);

  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map(mapSnapshotDoc));
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error("subscribeToAllRequests error:", error);
      }
    },
  );
};

export const subscribeToRequestById = (requestId, callback, onError) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);

  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback(mapSnapshotDoc(snapshot));
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error("subscribeToRequestById error:", error);
      }
    },
  );
};

export const subscribeToRequestsByUser = (userId, callback, onError) => {
  return subscribeToAllRequests(callback, { authorId: userId }, onError);
};

export const updateRequest = async (requestId, updates) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);

  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  return true;
};

export const deleteRequest = async (requestId) => {
  const ref = doc(db, COLLECTIONS.REQUESTS, requestId);
  await deleteDoc(ref);
  return true;
};
