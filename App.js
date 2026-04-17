import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import linking from "./src/navigation/linking";
import AppProvider from "./src/context/AppProvider";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
