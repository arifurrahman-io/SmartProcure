import { create } from "zustand";

const useRequestStore = create((set) => ({
  requests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,

  setRequests: (requests) => set({ requests }),
  setSelectedRequest: (selectedRequest) => set({ selectedRequest }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),

  addRequest: (request) =>
    set((state) => ({
      requests: [request, ...state.requests],
    })),

  updateRequestInStore: (requestId, updates) =>
    set((state) => ({
      requests: state.requests.map((item) =>
        item.id === requestId ? { ...item, ...updates } : item,
      ),
      selectedRequest:
        state.selectedRequest?.id === requestId
          ? { ...state.selectedRequest, ...updates }
          : state.selectedRequest,
    })),

  removeRequest: (requestId) =>
    set((state) => ({
      requests: state.requests.filter((item) => item.id !== requestId),
      selectedRequest:
        state.selectedRequest?.id === requestId ? null : state.selectedRequest,
    })),

  clearRequestState: () =>
    set({
      requests: [],
      selectedRequest: null,
      isLoading: false,
      error: null,
    }),
}));

export default useRequestStore;
