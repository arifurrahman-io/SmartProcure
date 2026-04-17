import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AuthProvider from "./AuthProvider";

export default function AppProvider({ children }) {
  return (
    <SafeAreaProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toast />
    </SafeAreaProvider>
  );
}
