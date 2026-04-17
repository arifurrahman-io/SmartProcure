import { useCallback, useEffect, useState } from "react";
import { getDashboardSummary } from "../services/firebase/dashboardService";

export default function useDashboardStats(autoLoad = true) {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingApprovals: 0,
    completedInstructions: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const summary = await getDashboardSummary();
      setStats(summary);
    } catch (err) {
      console.log("fetchDashboardStats error:", err);
      setError(err?.message || "Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      fetchDashboardStats();
    }
  }, [autoLoad, fetchDashboardStats]);

  return {
    stats,
    isLoading,
    error,
    fetchDashboardStats,
  };
}
