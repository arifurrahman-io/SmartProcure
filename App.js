import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppNavigator from "./src/navigation/AppNavigator";
import linking from "./src/navigation/linking";
import AppProvider from "./src/context/AppProvider";
import useAuthStore from "./src/store/useAuthStore";

function AppBootstrap() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const disposeAuth = useAuthStore((state) => state.disposeAuth);

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

  return (
    <NavigationContainer linking={linking}>
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
