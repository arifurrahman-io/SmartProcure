import { useCallback, useEffect, useState } from "react";
import {
  getAllHistory,
  getHistoryById,
} from "../services/firebase/historyService";

export default function useHistory(historyId = null, autoLoad = true) {
  const [history, setHistory] = useState([]);
  const [historyRecord, setHistoryRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAllHistory();
      setHistory(data);
    } catch (err) {
      console.log("fetchHistory error:", err);
      setError(err?.message || "Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistoryRecord = useCallback(async () => {
    if (!historyId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getHistoryById(historyId);
      setHistoryRecord(data);
    } catch (err) {
      console.log("fetchHistoryRecord error:", err);
      setError(err?.message || "Failed to load audit trail");
    } finally {
      setIsLoading(false);
    }
  }, [historyId]);

  useEffect(() => {
    if (!autoLoad) return;

    if (historyId) {
      fetchHistoryRecord();
    } else {
      fetchHistory();
    }
  }, [autoLoad, historyId, fetchHistory, fetchHistoryRecord]);

  return {
    history,
    historyRecord,
    isLoading,
    error,
    fetchHistory,
    fetchHistoryRecord,
  };
}
