import { create } from "zustand";

const useQuotationStore = create((set) => ({
  quotations: [],
  selectedQuotation: null,
  isLoading: false,
  error: null,

  setQuotations: (quotations) => set({ quotations }),
  setSelectedQuotation: (selectedQuotation) => set({ selectedQuotation }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),

  addQuotation: (quotation) =>
    set((state) => ({
      quotations: [quotation, ...state.quotations],
    })),

  updateQuotationInStore: (quotationId, updates) =>
    set((state) => ({
      quotations: state.quotations.map((item) =>
        item.id === quotationId ? { ...item, ...updates } : item,
      ),
      selectedQuotation:
        state.selectedQuotation?.id === quotationId
          ? { ...state.selectedQuotation, ...updates }
          : state.selectedQuotation,
    })),

  markApprovedQuotation: (quotationId) =>
    set((state) => ({
      quotations: state.quotations.map((item) => ({
        ...item,
        isApproved: item.id === quotationId,
      })),
      selectedQuotation:
        state.selectedQuotation?.id === quotationId
          ? { ...state.selectedQuotation, isApproved: true }
          : state.selectedQuotation,
    })),

  clearQuotationState: () =>
    set({
      quotations: [],
      selectedQuotation: null,
      isLoading: false,
      error: null,
    }),
}));

export default useQuotationStore;
