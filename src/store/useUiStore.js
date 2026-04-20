import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const { createJSONStorage, persist } = require("zustand/middleware");

const useUiStore = create(
  persist(
    (set) => ({
      isGlobalLoading: false,
      activeModal: null,
      activeBottomSheet: null,
      themeMode: "light",
      pushEnabled: true,
      emailEnabled: false,
      toastMessage: null,

      setGlobalLoading: (value) => set({ isGlobalLoading: value }),
      setActiveModal: (modalName) => set({ activeModal: modalName }),
      setActiveBottomSheet: (sheetName) => set({ activeBottomSheet: sheetName }),
      setThemeMode: (themeMode) => set({ themeMode }),
      setPushEnabled: (pushEnabled) => set({ pushEnabled }),
      setEmailEnabled: (emailEnabled) => set({ emailEnabled }),
      setToastMessage: (toastMessage) => set({ toastMessage }),

      clearUiState: () =>
        set({
          isGlobalLoading: false,
          activeModal: null,
          activeBottomSheet: null,
          toastMessage: null,
        }),
    }),
    {
      name: "smartprocure-ui-settings",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        pushEnabled: state.pushEnabled,
        emailEnabled: state.emailEnabled,
      }),
    },
  ),
);

export default useUiStore;
