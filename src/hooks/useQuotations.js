import { useCallback, useEffect } from "react";
import {
  createQuotation,
  getQuotationsByRequest,
  approveQuotation,
} from "../services/firebase/quotationService";
import {
  getRequestById,
  updateRequest,
} from "../services/firebase/requestService";
import { createInstruction } from "../services/firebase/instructionService";
import useAuthStore from "../store/useAuthStore";
import useQuotationStore from "../store/useQuotationStore";

export default function useQuotations(requestId, autoLoad = true) {
  const {
    quotations,
    isLoading,
    error,
    setQuotations,
    setIsLoading,
    setError,
    addQuotation,
    markApprovedQuotation,
  } = useQuotationStore();

  const profile = useAuthStore((state) => state.profile);

  const fetchQuotations = useCallback(async () => {
    if (!requestId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getQuotationsByRequest(requestId);
      setQuotations(data);
    } catch (err) {
      console.log("fetchQuotations error:", err);
      setError(err?.message || "Failed to load quotations");
    } finally {
      setIsLoading(false);
    }
  }, [requestId, setQuotations, setIsLoading, setError]);

  const submitQuotation = useCallback(
    async (payload) => {
      try {
        setIsLoading(true);
        setError(null);

        const quotationPayload = {
          ...payload,
          requestId,
          submittedBy: profile?.name || "Unknown User",
          submittedById: profile?.id || profile?.uid || null,
        };

        const id = await createQuotation(quotationPayload);

        const created = {
          id,
          ...quotationPayload,
          isApproved: false,
        };

        addQuotation(created);
        return created;
      } catch (err) {
        console.log("submitQuotation error:", err);
        setError(err?.message || "Failed to submit quotation");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [profile, requestId, addQuotation, setIsLoading, setError],
  );

  const approveSelectedQuotation = useCallback(
    async (quotationId) => {
      try {
        setIsLoading(true);
        setError(null);

        const approvedBy = profile?.name || "Admin";
        const approvedAt = new Date().toISOString();
        const selectedQuotation = quotations.find(
          (item) => item.id === quotationId,
        );
        const request = requestId ? await getRequestById(requestId) : null;

        await approveQuotation(quotationId, approvedBy);

        if (requestId) {
          await updateRequest(requestId, {
            status: "Approved",
            approvedQuotationId: quotationId,
            approvedBy,
            approvedAt,
          });
        }

        if (selectedQuotation || request) {
          await createInstruction({
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
            amount: Number(selectedQuotation?.amount || 0),
            campus: request?.campus || selectedQuotation?.campus || "",
            shift: request?.shift || selectedQuotation?.shift || "",
            approvedBy,
            approvedAt,
            status: "Approved",
          });
        }

        markApprovedQuotation(quotationId);

        return true;
      } catch (err) {
        console.log("approveSelectedQuotation error:", err);
        setError(err?.message || "Failed to approve quotation");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [
      profile,
      quotations,
      requestId,
      markApprovedQuotation,
      setIsLoading,
      setError,
    ],
  );

  useEffect(() => {
    if (autoLoad) {
      fetchQuotations();
    }
  }, [autoLoad, fetchQuotations]);

  return {
    quotations,
    isLoading,
    error,
    fetchQuotations,
    submitQuotation,
    approveSelectedQuotation,
  };
}
