import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingScreen from "../screens/auth/LoadingScreen";
import MainTabNavigator from "./MainTabNavigator";
import AuthNavigator from "./AuthNavigator";

import NotificationsScreen from "../screens/notification/NotificationsScreen";
import SettingsScreen from "../screens/profile/SettingsScreen";
import InstructionDetailsScreen from "../screens/instruction/InstructionDetailsScreen";
import AuditTrailScreen from "../screens/history/AuditTrailScreen";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import PendingApprovalsScreen from "../screens/admin/PendingApprovalsScreen";
import UserManagementScreen from "../screens/admin/UserManagementScreen";
import ReportsScreen from "../screens/admin/ReportsScreen";

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
        <Stack.Screen name={ROUTES.AUTH_ROOT} component={AuthNavigator} />
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

      {isAdmin ? (
        <>
          <Stack.Screen
            name={ROUTES.ADMIN_DASHBOARD}
            component={AdminDashboardScreen}
          />
          <Stack.Screen
            name={ROUTES.PENDING_APPROVALS}
            component={PendingApprovalsScreen}
          />
          <Stack.Screen
            name={ROUTES.USER_MANAGEMENT}
            component={UserManagementScreen}
          />
          <Stack.Screen name={ROUTES.REPORTS} component={ReportsScreen} />
        </>
      ) : null}
    </Stack.Navigator>
  );
}
