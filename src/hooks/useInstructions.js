import { useCallback, useEffect, useState } from "react";
import {
  getAllInstructions,
  getInstructionById,
  markInstructionCompleted,
} from "../services/firebase/instructionService";

export default function useInstructions(instructionId = null, autoLoad = true) {
  const [instructions, setInstructions] = useState([]);
  const [instruction, setInstruction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInstructions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAllInstructions();
      setInstructions(data);
    } catch (err) {
      console.log("fetchInstructions error:", err);
      setError(err?.message || "Failed to load instructions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInstructionDetails = useCallback(async () => {
    if (!instructionId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getInstructionById(instructionId);
      setInstruction(data);
    } catch (err) {
      console.log("fetchInstructionDetails error:", err);
      setError(err?.message || "Failed to load instruction details");
    } finally {
      setIsLoading(false);
    }
  }, [instructionId]);

  const completeInstruction = useCallback(
    async (completionNote) => {
      if (!instructionId) return;

      try {
        setIsLoading(true);
        setError(null);

        await markInstructionCompleted(instructionId, completionNote);

        setInstruction((prev) =>
          prev
            ? {
                ...prev,
                status: "Completed",
                completionNote,
              }
            : prev,
        );

        setInstructions((prev) =>
          prev.map((item) =>
            item.id === instructionId
              ? { ...item, status: "Completed", completionNote }
              : item,
          ),
        );

        return true;
      } catch (err) {
        console.log("completeInstruction error:", err);
        setError(err?.message || "Failed to complete instruction");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [instructionId],
  );

  useEffect(() => {
    if (!autoLoad) return;

    if (instructionId) {
      fetchInstructionDetails();
    } else {
      fetchInstructions();
    }
  }, [autoLoad, instructionId, fetchInstructions, fetchInstructionDetails]);

  return {
    instructions,
    instruction,
    isLoading,
    error,
    fetchInstructions,
    fetchInstructionDetails,
    completeInstruction,
  };
}
