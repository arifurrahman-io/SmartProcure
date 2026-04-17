import { useCallback, useEffect, useState } from "react";
import {
  getRequestById,
  updateRequest,
} from "../services/firebase/requestService";

export default function useRequestDetails(requestId) {
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequestDetails = useCallback(async () => {
    if (!requestId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getRequestById(requestId);
      setRequest(data);
    } catch (err) {
      console.log("fetchRequestDetails error:", err);
      setError(err?.message || "Failed to load request details");
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  const editRequest = useCallback(
    async (updates) => {
      if (!requestId) return;

      try {
        setIsLoading(true);
        setError(null);

        await updateRequest(requestId, updates);
        setRequest((prev) => ({
          ...prev,
          ...updates,
        }));

        return true;
      } catch (err) {
        console.log("editRequest error:", err);
        setError(err?.message || "Failed to update request");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [requestId],
  );

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  return {
    request,
    isLoading,
    error,
    fetchRequestDetails,
    editRequest,
  };
}
