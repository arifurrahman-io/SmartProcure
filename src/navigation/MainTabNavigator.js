import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/dashboard/DashboardScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import RequestStackNavigator from "./RequestStackNavigator";
import InstructionListScreen from "../screens/instruction/InstructionListScreen";
import HistoryListScreen from "../screens/history/HistoryListScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ROUTES from "./routes";
import useUserRole from "../hooks/useUserRole";

const Tab = createBottomTabNavigator();

const getTabIcon = (routeName, focused) => {
  switch (routeName) {
    case ROUTES.DASHBOARD:
      return focused ? "grid" : "grid-outline";

    case ROUTES.REQUESTS:
      return focused ? "document-text" : "document-text-outline";

    case ROUTES.INSTRUCTIONS:
      return focused ? "clipboard" : "clipboard-outline";

    case ROUTES.HISTORY:
      return focused ? "time" : "time-outline";

    case ROUTES.PROFILE:
      return focused ? "person" : "person-outline";

    default:
      return focused ? "ellipse" : "ellipse-outline";
  }
};

export default function MainTabNavigator() {
  const { isAdmin } = useUserRole();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          backgroundColor: "#FFFFFF",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800",
        },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={size || 22}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name={ROUTES.DASHBOARD}
        options={{ tabBarLabel: "Dashboard" }}
      >
        {(props) =>
          isAdmin ? (
            <AdminDashboardScreen {...props} />
          ) : (
            <DashboardScreen {...props} />
          )
        }
      </Tab.Screen>

      <Tab.Screen
        name={ROUTES.REQUESTS}
        component={RequestStackNavigator}
        options={{ tabBarLabel: "Requests" }}
      />

      <Tab.Screen
        name={ROUTES.INSTRUCTIONS}
        component={InstructionListScreen}
        options={{ tabBarLabel: "Instructions" }}
      />

      <Tab.Screen
        name={ROUTES.HISTORY}
        component={HistoryListScreen}
        options={{ tabBarLabel: "History" }}
      />

      <Tab.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}
