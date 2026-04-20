import { useEffect } from "react";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppNavigator from "./src/navigation/AppNavigator";
import linking from "./src/navigation/linking";
import AppProvider from "./src/context/AppProvider";
import useAuthStore from "./src/store/useAuthStore";
import useAppTheme from "./src/hooks/useAppTheme";
import useUiStore from "./src/store/useUiStore";

const isValidThemeMode = (mode) => ["light", "dark", "system"].includes(mode);

function AppBootstrap() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const disposeAuth = useAuthStore((state) => state.disposeAuth);
  const profile = useAuthStore((state) => state.profile);
  const setThemeMode = useUiStore((state) => state.setThemeMode);
  const setPushEnabled = useUiStore((state) => state.setPushEnabled);
  const setEmailEnabled = useUiStore((state) => state.setEmailEnabled);
  const { theme, isDark } = useAppTheme();
  const navigationTheme = {
    ...(isDark ? NavigationDarkTheme : NavigationDefaultTheme),
    colors: {
      ...(isDark ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
    },
  };

  useEffect(() => {
    const unsubscribe = initializeAuth();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      } else {
        disposeAuth();
      }
    };
  }, [initializeAuth, disposeAuth]);

  useEffect(() => {
    const preferences = profile?.preferences || {};
    const notificationPreferences = preferences.notifications || {};

    if (isValidThemeMode(preferences.themeMode)) {
      setThemeMode(preferences.themeMode);
    }

    if (typeof notificationPreferences.pushEnabled === "boolean") {
      setPushEnabled(notificationPreferences.pushEnabled);
    }

    if (typeof notificationPreferences.emailEnabled === "boolean") {
      setEmailEnabled(notificationPreferences.emailEnabled);
    }
  }, [profile, setEmailEnabled, setPushEnabled, setThemeMode]);

  return (
    <NavigationContainer linking={linking} theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <AppBootstrap />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
