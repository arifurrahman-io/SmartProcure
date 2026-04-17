import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import linking from "./src/navigation/linking";
import AppProvider from "./src/context/AppProvider";

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
