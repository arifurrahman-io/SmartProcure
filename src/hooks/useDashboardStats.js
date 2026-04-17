import { useCallback, useEffect, useRef, useState } from "react";
import { getDashboardSummary } from "../services/firebase/dashboardService";
import { logError } from "../utils/logger";

const INITIAL_STATE = {
  totalRequests: 0,
  pendingApprovals: 0,
  completedInstructions: 0,
  activeInstructions: 0,
  totalUsers: 0,
};

export default function useDashboardStats(autoLoad = true) {
  const [stats, setStats] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);

  // =========================
  // Fetch Stats
  // =========================
  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const summary = await getDashboardSummary();

      // Defensive fallback
      const safeSummary = {
        ...INITIAL_STATE,
        ...(summary || {}),
      };

      if (isMountedRef.current) {
        setStats(safeSummary);
      }

      return safeSummary;
    } catch (err) {
      logError("fetchDashboardStats error:", err);

      if (isMountedRef.current) {
        setError(err?.message || "Failed to load dashboard stats");
      }

      throw err;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  // =========================
  // Reset (optional use)
  // =========================
  const resetStats = useCallback(() => {
    setStats(INITIAL_STATE);
    setError(null);
    setIsLoading(false);
  }, []);

  // =========================
  // Auto Load
  // =========================
  useEffect(() => {
    isMountedRef.current = true;

    if (autoLoad) {
      fetchDashboardStats();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoLoad, fetchDashboardStats]);

  return {
    stats,
    isLoading,
    error,
    fetchDashboardStats,
    resetStats,
  };
}
