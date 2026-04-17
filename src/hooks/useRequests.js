import { useCallback, useEffect } from "react";
import {
  createRequest,
  getAllRequests,
} from "../services/firebase/requestService";
import useRequestStore from "../store/useRequestStore";
import useAuthStore from "../store/useAuthStore";

export default function useRequests(autoLoad = true) {
  const {
    requests,
    isLoading,
    error,
    setRequests,
    setIsLoading,
    setError,
    addRequest,
  } = useRequestStore();

  const profile = useAuthStore((state) => state.profile);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAllRequests();
      setRequests(data);
    } catch (err) {
      console.log("fetchRequests error:", err);
      setError(err?.message || "Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  }, [setRequests, setIsLoading, setError]);

  const submitRequest = useCallback(
    async (payload) => {
      try {
        setIsLoading(true);
        setError(null);

        const requestPayload = {
          ...payload,
          createdBy: profile?.id || profile?.uid || null,
          requesterName: profile?.name || "Unknown User",
          requesterEmail: profile?.email || "",
          status: payload.status || "Pending",
        };

        const id = await createRequest(requestPayload);

        const createdRequest = {
          id,
          ...requestPayload,
        };

        addRequest(createdRequest);
        return createdRequest;
      } catch (err) {
        console.log("submitRequest error:", err);
        setError(err?.message || "Failed to create request");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [profile, addRequest, setIsLoading, setError],
  );

  useEffect(() => {
    if (autoLoad) {
      fetchRequests();
    }
  }, [autoLoad, fetchRequests]);

  return {
    requests,
    isLoading,
    error,
    fetchRequests,
    submitRequest,
  };
}
