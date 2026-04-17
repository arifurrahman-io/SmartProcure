import { create } from "zustand";

const useUiStore = create((set) => ({
  isGlobalLoading: false,
  activeModal: null,
  activeBottomSheet: null,
  themeMode: "light",
  toastMessage: null,

  setGlobalLoading: (value) => set({ isGlobalLoading: value }),
  setActiveModal: (modalName) => set({ activeModal: modalName }),
  setActiveBottomSheet: (sheetName) => set({ activeBottomSheet: sheetName }),
  setThemeMode: (themeMode) => set({ themeMode }),
  setToastMessage: (toastMessage) => set({ toastMessage }),

  clearUiState: () =>
    set({
      isGlobalLoading: false,
      activeModal: null,
      activeBottomSheet: null,
      toastMessage: null,
    }),
}));

export default useUiStore;
