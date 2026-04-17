import { useState } from "react";
import {
  uploadFileToStorage,
  uriToBlob,
} from "../services/firebase/uploadService";

export default function useUploadFile() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async ({ uri, path }) => {
    try {
      setIsUploading(true);
      setError(null);

      const fileBlob = await uriToBlob(uri);
      const downloadURL = await uploadFileToStorage({
        path,
        fileBlob,
      });

      return downloadURL;
    } catch (err) {
      console.log("uploadFile error:", err);
      setError(err?.message || "File upload failed");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    error,
    uploadFile,
  };
}
