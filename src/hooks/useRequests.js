import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createRequest,
  getAllRequests,
  subscribeToAllRequests,
} from "../services/firebase/requestService";
import useAuthStore from "../store/useAuthStore";

const INITIAL_STATE = {
  requests: [],
  loading: false,
  error: null,
};

export default function useRequests(autoLoad = true, options = {}) {
  const { user, profile } = useAuthStore();

  const [requests, setRequests] = useState(INITIAL_STATE.requests);
  const [loading, setLoading] = useState(autoLoad);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(INITIAL_STATE.error);

  const filters = useMemo(() => {
    const role = profile?.role;
    const campus = profile?.campus;
    const userId = profile?.id || profile?.uid || user?.uid;

    if (options.filters) {
      return options.filters;
    }

    if (role === "admin" || role === "head") {
      return {};
    }

    if (role === "committee" || role === "purchase_committee") {
      return campus ? { campus } : {};
    }

    if (role === "staff") {
      return userId ? { authorId: userId } : {};
    }

    return {};
  }, [options.filters, profile, user]);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllRequests(filters);
      setRequests(data);

      return data;
    } catch (err) {
      const message = err?.message || "Failed to load requests.";
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshRequests = useCallback(async () => {
    return loadRequests();
  }, [loadRequests]);

  const submitRequest = useCallback(
    async (payload) => {
      try {
        setSubmitting(true);
        setError(null);

        const userId = user?.id || user?.uid;

        const requestPayload = {
          ...payload,
          authorId: payload.authorId || userId || null,
          authorName:
            payload.authorName ||
            profile?.name ||
            user?.displayName ||
            user?.email ||
            "Unknown User",
          authorEmail: payload.authorEmail || profile?.email || user?.email || "",
          campus: payload.campus || profile?.campus || null,
          status: payload.status || "pending",
        };

        const requestId = await createRequest(requestPayload);
        return { success: true, requestId };
      } catch (err) {
        const message = err?.message || "Failed to submit request.";
        setError(message);
        return { success: false, error: message };
      } finally {
        setSubmitting(false);
      }
    },
    [profile, user],
  );

  useEffect(() => {
    if (!autoLoad) {
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAllRequests(
      (data) => {
        setRequests(data);
        setLoading(false);
      },
      filters,
      (err) => {
        setError(err?.message || "Failed to subscribe to requests.");
        setLoading(false);
      },
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [autoLoad, filters]);

  return {
    requests,
    loading,
    isLoading: loading,
    submitting,
    error,
    refreshRequests,
    loadRequests,
    submitRequest,
    setRequests,
  };
}
