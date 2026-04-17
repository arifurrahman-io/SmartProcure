import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingScreen from "../screens/auth/LoadingScreen";
import MainTabNavigator from "./MainTabNavigator";
import AuthNavigator from "./AuthNavigator";
import AdminStackNavigator from "./AdminStackNavigator";

import NotificationsScreen from "../screens/notification/NotificationsScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import InstructionDetailsScreen from "../screens/instruction/InstructionDetailsScreen";
import AuditTrailScreen from "../screens/history/AuditTrailScreen";

import ROUTES from "./routes";
import useAuthStore from "../store/useAuthStore";
import { isAdminRole } from "../utils/roleHelpers";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, profile } = useAuthStore();

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.LOADING} component={LoadingScreen} />
      </Stack.Navigator>
    );
  }

  const isAdmin = isAdminRole(profile?.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="AuthRoot" component={AuthNavigator} />
      ) : isAdmin ? (
        <Stack.Screen name="AdminRoot" component={AdminStackNavigator} />
      ) : (
        <Stack.Screen name={ROUTES.MAIN_TABS} component={MainTabNavigator} />
      )}

      <Stack.Screen
        name={ROUTES.NOTIFICATIONS}
        component={NotificationsScreen}
      />

      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />

      <Stack.Screen
        name={ROUTES.INSTRUCTION_DETAILS}
        component={InstructionDetailsScreen}
      />

      <Stack.Screen name={ROUTES.AUDIT_TRAIL} component={AuditTrailScreen} />
    </Stack.Navigator>
  );
}
