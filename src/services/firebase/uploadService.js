import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";

export const uploadFileToStorage = async ({ path, fileBlob }) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, fileBlob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
