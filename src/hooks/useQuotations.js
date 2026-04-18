import { useCallback, useEffect, useState } from "react";
import {
  createQuotation,
  getQuotationCountByRequest,
  getQuotationsByRequest,
  approveQuotation,
} from "../services/firebase/quotationService";
import {
  getRequestById,
  updateRequest,
} from "../services/firebase/requestService";
import { createInstruction } from "../services/firebase/instructionService";
import useAuthStore from "../store/useAuthStore";

const INITIAL_STATE = {
  quotations: [],
  isLoading: false,
  error: null,
};

const normalizeAmount = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

export default function useQuotations(requestId, autoLoad = true) {
  const profile = useAuthStore((state) => state.profile);

  const [quotations, setQuotations] = useState(INITIAL_STATE.quotations);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState(INITIAL_STATE.error);

  const fetchQuotations = useCallback(async () => {
    if (!requestId) {
      setQuotations([]);
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await getQuotationsByRequest(requestId);
      setQuotations(data);
      return data;
    } catch (err) {
      console.log("fetchQuotations error:", err);
      const message = err?.message || "Failed to load quotations";
      setError(message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  const refreshQuotations = useCallback(async () => {
    return fetchQuotations();
  }, [fetchQuotations]);

  const submitQuotation = useCallback(
    async (payload) => {
      if (!requestId) {
        const message = "Request ID is required.";
        setError(message);
        return { success: false, error: message };
      }

      try {
        setIsSubmitting(true);
        setError(null);

        const quotationPayload = {
          ...payload,
          requestId,
          submittedBy: profile?.name || profile?.displayName || "Unknown User",
          submittedById: profile?.id || profile?.uid || null,
          isApproved: false,
        };

        const id = await createQuotation(quotationPayload);

        const created = {
          id,
          ...quotationPayload,
        };

        setQuotations((prev) => [created, ...prev]);

        const latestCount = Math.max(
          await getQuotationCountByRequest(requestId),
          quotations.length + 1,
        );
        try {
          await updateRequest(requestId, {
            quotationCount: latestCount,
            lastQuotationAt: new Date().toISOString(),
            status:
              String(payload?.status || "").toLowerCase() === "draft"
                ? "pending"
                : "quotation_received",
          });
        } catch (requestUpdateError) {
          console.log("updateRequest after quotation error:", requestUpdateError);
        }

        return { success: true, data: created };
      } catch (err) {
        console.log("submitQuotation error:", err);
        const message = err?.message || "Failed to submit quotation";
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsSubmitting(false);
      }
    },
    [profile, quotations.length, requestId],
  );

  const approveSelectedQuotation = useCallback(
    async (quotationId) => {
      if (!requestId) {
        const message = "Request ID is required.";
        setError(message);
        return { success: false, error: message };
      }

      try {
        setIsApproving(true);
        setError(null);

        const approvedBy = profile?.name || profile?.displayName || "Admin";
        const approvedById = profile?.id || profile?.uid || null;
        const approvedAt = new Date().toISOString();

        const selectedQuotation = quotations.find(
          (item) => item.id === quotationId,
        );
        const request = await getRequestById(requestId);

        if (!selectedQuotation) {
          throw new Error("Selected quotation not found.");
        }

        if (!request) {
          throw new Error("Request not found.");
        }

        await approveQuotation(quotationId, approvedBy);

        const instructionPayload = {
          requestId,
          quotationId,
          itemName:
            request?.itemName ||
            request?.title ||
            selectedQuotation?.itemName ||
            "Untitled Item",
          vendorName: selectedQuotation?.vendorName || "Unknown Vendor",
          vendorContact:
            selectedQuotation?.vendorContact ||
            selectedQuotation?.vendorPhone ||
            "",
          specification:
            selectedQuotation?.specification ||
            request?.specification ||
            request?.description ||
            "",
          address:
            selectedQuotation?.address ||
            selectedQuotation?.vendorAddress ||
            "",
          amount: normalizeAmount(selectedQuotation?.amount),
          campus: request?.campus || selectedQuotation?.campus || "",
          shift: request?.shift || selectedQuotation?.shift || "",
          approvedBy,
          approvedById,
          approvedAt,
          status: "Approved",
        };

        const instructionId = await createInstruction(instructionPayload);

        await updateRequest(requestId, {
          status: "approved",
          approvedQuotationId: quotationId,
          selectedQuotationId: quotationId,
          approvedBy,
          approvedById,
          approvedAt,
          instructionId,
          instructionStatus: "approved",
        });

        setQuotations((prev) =>
          prev.map((item) => ({
            ...item,
            isApproved: item.id === quotationId,
            approvedBy: item.id === quotationId ? approvedBy : item.approvedBy,
            approvedAt: item.id === quotationId ? approvedAt : item.approvedAt,
          })),
        );

        return {
          success: true,
          data: {
            quotationId,
            instructionId,
            approvedAt,
          },
        };
      } catch (err) {
        console.log("approveSelectedQuotation error:", err);
        const message = err?.message || "Failed to approve quotation";
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsApproving(false);
      }
    },
    [profile, quotations, requestId],
  );

  useEffect(() => {
    if (!autoLoad) return;
    fetchQuotations();
  }, [autoLoad, fetchQuotations]);

  return {
    quotations,
    isLoading,
    isSubmitting,
    isApproving,
    error,
    fetchQuotations,
    refreshQuotations,
    submitQuotation,
    approveSelectedQuotation,
    setQuotations,
  };
}
