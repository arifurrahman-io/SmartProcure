import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import COLLECTIONS from "../../firebase/collections";

export const createNotification = async (payload) => {
  const ref = collection(db, COLLECTIONS.NOTIFICATIONS);
  const result = await addDoc(ref, {
    ...payload,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  return result.id;
};

export const getNotificationsByUser = async (userId) => {
  const ref = collection(db, COLLECTIONS.NOTIFICATIONS);
  const q = query(
    ref,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const markNotificationAsRead = async (notificationId) => {
  const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
  await updateDoc(ref, {
    isRead: true,
  });
  return true;
};

export const markAllNotificationsAsRead = async (notificationIds = []) => {
  const promises = notificationIds.map((id) =>
    updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { isRead: true }),
  );

  await Promise.all(promises);
  return true;
};
