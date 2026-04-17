import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import PendingApprovalsScreen from "../screens/admin/PendingApprovalsScreen";
import UserManagementScreen from "../screens/admin/UserManagementScreen";
import ReportsScreen from "../screens/admin/ReportsScreen";

import RequestDetailsScreen from "../screens/request/RequestDetailsScreen";
import InstructionDetailsScreen from "../screens/instruction/InstructionDetailsScreen";

import ROUTES from "./routes";

const Stack = createNativeStackNavigator();

export default function AdminStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

      <Stack.Screen
        name={ROUTES.REQUEST_DETAILS}
        component={RequestDetailsScreen}
      />

      <Stack.Screen
        name={ROUTES.INSTRUCTION_DETAILS}
        component={InstructionDetailsScreen}
      />
    </Stack.Navigator>
  );
}
