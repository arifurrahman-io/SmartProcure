import { useCallback, useEffect, useState } from "react";
import {
  getRequestById,
  subscribeToRequestById,
  updateRequest,
} from "../services/firebase/requestService";

const INITIAL_STATE = {
  request: null,
  loading: true,
  error: null,
};

export default function useRequestDetails(requestId, autoLoad = true) {
  const [request, setRequest] = useState(INITIAL_STATE.request);
  const [loading, setLoading] = useState(autoLoad);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(INITIAL_STATE.error);

  const loadRequest = useCallback(async () => {
    if (!requestId) {
      setRequest(null);
      setLoading(false);
      setError("Request ID is required.");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getRequestById(requestId);
      setRequest(data);

      if (!data) {
        setError("Request not found.");
      }

      return data;
    } catch (err) {
      const message = err?.message || "Failed to load request details.";
      setError(message);
      setRequest(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  const refreshRequest = useCallback(async () => {
    return loadRequest();
  }, [loadRequest]);

  const patchRequest = useCallback(
    async (updates) => {
      if (!requestId) {
        return { success: false, error: "Request ID is required." };
      }

      try {
        setUpdating(true);
        setError(null);

        await updateRequest(requestId, updates);

        return { success: true };
      } catch (err) {
        const message = err?.message || "Failed to update request.";
        setError(message);
        return { success: false, error: message };
      } finally {
        setUpdating(false);
      }
    },
    [requestId],
  );

  useEffect(() => {
    if (!autoLoad) {
      setLoading(false);
      return;
    }

    if (!requestId) {
      setRequest(null);
      setLoading(false);
      setError("Request ID is required.");
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToRequestById(
      requestId,
      (data) => {
        setRequest(data);
        setError(data ? null : "Request not found.");
        setLoading(false);
      },
      (err) => {
        setError(err?.message || "Failed to subscribe to request.");
        setLoading(false);
      },
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [requestId, autoLoad]);

  return {
    request,
    loading,
    updating,
    error,
    loadRequest,
    refreshRequest,
    updateRequest: patchRequest,
    setRequest,
  };
}
